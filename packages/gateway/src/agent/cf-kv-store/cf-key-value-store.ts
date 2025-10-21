import type { IKeyValueStore, IValueData, ValueStoreType } from '@veramo/kv-store'

/**
 * The types that can be stored by a store adapter
 */
interface KVStoreType {
  string?: string
  number?: string
  boolean?: string
  object?: string
}

/**
 * Class that implements the {@link @veramo/kv-store#IKeyValueStore} interface
 *
 * @public
 */
export class CFKeyValueStore<ValueType extends ValueStoreType>
  implements IKeyValueStore<ValueType>
{
  /**
   * Create a new CFKeyValueStore instance.
   *
   * @param ns KVNamespace instance
   * @param listPrefix Optional prefix for listing keys
   */
  constructor(
    private ns: KVNamespace,
    private listPrefix: string | null = null
  ) {}

  /** Get a single value (typed) or undefined if missing */
  async get(key: string): Promise<ValueType | undefined> {
    const v = await this.ns.get<KVStoreType>(key, { type: 'json' })
    if (v === null) return undefined
    if ('string' in v) return v.string as ValueType
    if ('number' in v) return Number(v.number) as unknown as ValueType
    if ('boolean' in v) return (v.boolean === ('true' as unknown)) as ValueType
    if ('object' in v) {
      try {
        return JSON.parse(v.object as string) as ValueType
      } catch {
        return undefined
      }
    }
    return undefined
  }

  /** Get a single item as ValueData */
  async getAsValueData(key: string): Promise<IValueData<ValueType>> {
    const value = await this.get(key)
    return { value: value as ValueType }
  }

  /**
   * Iterate over ALL keys (optionally under a prefix if provided in constructor).
   * Yields `{ key }` for each entry. Change to yield full values if you prefer.
   */
  async *getIterator(): AsyncGenerator<{ key: string }, void> {
    let cursor: string | null = null
    do {
      const page: KVNamespaceListResult<{}, string> = await this.ns.list({
        cursor,
        prefix: this.listPrefix,
      })
      for (const k of page.keys) yield { key: k.name }
      cursor = page.list_complete ? null : page.cursor
    } while (cursor)
  }

  /** Get many values by keys (keeps order; missing entries => undefined) */
  async getMany(keys: string[]): Promise<Array<ValueType | undefined>> {
    return Promise.all(keys.map(k => this.get(k)))
  }

  /** Get many items as ValueData */
  async getManyAsValueData(keys: string[]): Promise<Array<IValueData<ValueType>>> {
    const values = await this.getMany(keys)
    return keys
      .filter((_, i) => values[i] !== undefined)
      .map((key, i) => ({ key, value: values[i] as ValueType }))
  }

  /** Set a single value (stored as JSON); optional TTL in milliseconds */
  async set(key: string, value: ValueType, ttl?: number): Promise<IValueData<ValueType>> {
    const options: KVNamespacePutOptions = ttl
      ? { expirationTtl: Math.max(1, Math.ceil(ttl / 1000)) }
      : {}
    // Store value as JSON if object, else as string
    await this.ns.put(key, JSON.stringify(this._setValueStoreType(value)), options)
    const response: IValueData<ValueType> = { value }
    if (ttl) {
      response['expires'] = ttl
    }
    return response
  }

  /** Delete a single key; returns true if no error (KV doesn't report existence) */
  async delete(key: string): Promise<boolean> {
    await this.ns.delete(key)
    return true
  }

  /** Delete multiple keys (batched) */
  async deleteMany(keys: string[]): Promise<boolean[]> {
    // Reasonable concurrency
    const batch = 50
    const results: boolean[] = []
    for (let i = 0; i < keys.length; i += batch) {
      const slice = keys.slice(i, i + batch)
      const settled = await Promise.allSettled(slice.map(k => this.ns.delete(k)))
      for (const s of settled) results.push(s.status === 'fulfilled')
    }
    return results
  }

  /**
   * Clear the whole store (or prefix if this.listPrefix is set).
   * WARNING: For very large namespaces, prefer running this from a cron or admin task.
   */
  async clear(): Promise<IKeyValueStore<ValueType>> {
    // Page through all keys (optionally by prefix) and delete in batches
    let cursor: string | null = null
    const batch = 100
    do {
      const page: KVNamespaceListResult<{}, string> = await this.ns.list({
        cursor,
        prefix: this.listPrefix,
        limit: 1000,
      })
      for (let i = 0; i < page.keys.length; i += batch) {
        const slice = page.keys.slice(i, i + batch)
        await Promise.allSettled(slice.map(k => this.ns.delete(k.name)))
      }
      cursor = page.list_complete ? null : page.cursor
    } while (cursor)

    return this
  }

  /** No-op for KV, included for interface completeness */
  async has(key: string): Promise<boolean> {
    // KV doesn't support HEAD; read with metadata-less GET to check existence cheaply
    const v = await this.ns.get(key, 'stream') // cheaper than JSON parse
    return v !== null
  }

  /** No-op; KV is connectionless. Included for interface completeness. */
  async disconnect(): Promise<void> {
    // nothing to do
  }

  /**
   * Get the value as the store type at runtime
   *
   * @param value The value to convert to the store type
   * @returns The value as the store type
   */
  private _setValueStoreType(value: ValueType): KVStoreType {
    if (typeof value === 'string' || value instanceof String) {
      return { string: `${value}` }
    } else if (typeof value === 'number' || value instanceof Number) {
      return { number: `${value}` }
    } else if (typeof value === 'boolean' || value instanceof Boolean) {
      return { boolean: `${value}` }
    } else if (typeof value === 'object') {
      return { object: JSON.stringify(value) }
    } else {
      throw new Error('Unsupported value type')
    }
  }
}
