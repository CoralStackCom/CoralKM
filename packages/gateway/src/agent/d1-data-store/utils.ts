import type { FindArgs, Where } from '@veramo/core-types'

/**
 * Builds a full SQL query string and parameters array from FindArgs.
 *
 * @param select The SELECT clause of the SQL query
 * @param args The FindArgs containing query conditions
 * @param columnMap Optional mapping from logical to physical column names
 * @returns The full SQL query string and parameters array
 */
export function buildQ1Query<T extends string>(
  select: string,
  args: FindArgs<T>,
  columnMap?: Partial<Record<T, string>>
): { sql: string; params: (string | number | null)[] } {
  const { where = [], order = [], skip, take } = args ?? {}

  // WHERE
  const { clause: whereClause, params } = buildWhere(where, columnMap)

  // ORDER BY
  const q = (name: string) => `"${name.replace(/"/g, '""')}"`
  const orderBy =
    order.length > 0
      ? ' ORDER BY ' +
        order
          .map(o => {
            const physical = (columnMap?.[o.column] ?? o.column) as string
            const dir = String((o as any).direction || '').toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
            return `${q(physical)} ${dir}`
          })
          .join(', ')
      : ''

  // LIMIT / OFFSET (SQLite)
  // - If only take:        LIMIT ?
  // - If only skip:        LIMIT -1 OFFSET ?
  // - If both:             LIMIT ? OFFSET ?
  // - If neither:          (omit)
  let limitOffset = ''
  const limitParams: (number | string | null)[] = []

  const hasTake = Number.isFinite(take as number)
  const hasSkip = Number.isFinite(skip as number)

  if (hasTake && hasSkip) {
    limitOffset = ' LIMIT ? OFFSET ?'
    limitParams.push(Number(take), Number(skip))
  } else if (hasTake) {
    limitOffset = ' LIMIT ?'
    limitParams.push(Number(take))
  } else if (hasSkip) {
    // SQLite idiom for "skip N, unlimited rows"
    limitOffset = ' LIMIT -1 OFFSET ?'
    limitParams.push(Number(skip))
  }

  const sql = select.trim() + (whereClause ? ' ' + whereClause : '') + orderBy + limitOffset

  return { sql, params: [...params, ...limitParams] }
}

/**
 * Build a SQLite WHERE clause and params from Where[].
 * - Joins conditions with AND.
 * - Uses placeholders (?) for all values.
 * - Escapes column identifiers with double quotes.
 * - `Any` is treated as `In`.
 * - If `In/Any` has an empty value array: emits (1=0) or (1=1) depending on .not.
 */
function buildWhere<T extends string>(
  conditions: Where<T>[],
  columnMap?: Partial<Record<T, string>> // optional mapping from logical to physical column names
): { clause: string; params: (string | number | null)[] } {
  const frags: string[] = []
  const params: (string | number | null)[] = []

  const q = (name: string) => `"${name.replace(/"/g, '""')}"`

  for (const c of conditions ?? []) {
    const colName = columnMap?.[c.column] ?? c.column
    if (!colName) throw new Error('Invalid column')
    const col = q(colName)
    const op = c.op ?? 'Equal'
    const not = !!c.not
    const vals = c.value ?? []

    const needVals = (n: number, label = op) => {
      if (vals.length < n) throw new Error(`Operator ${label} requires ${n} value(s)`)
    }

    switch (op) {
      case 'IsNull': {
        frags.push(`${col} IS ${not ? 'NOT ' : ''}NULL`)
        break
      }
      case 'LessThan': {
        needVals(1)
        frags.push(`${col} < ?`)
        params.push(vals[0])
        break
      }
      case 'LessThanOrEqual': {
        needVals(1)
        frags.push(`${col} <= ?`)
        params.push(vals[0])
        break
      }
      case 'MoreThan': {
        needVals(1)
        frags.push(`${col} > ?`)
        params.push(vals[0])
        break
      }
      case 'MoreThanOrEqual': {
        needVals(1)
        frags.push(`${col} >= ?`)
        params.push(vals[0])
        break
      }
      case 'Equal': {
        needVals(1)
        frags.push(`${col} ${not ? '!=' : '='} ?`)
        params.push(vals[0])
        break
      }
      case 'Like': {
        needVals(1)
        frags.push(`${col} ${not ? 'NOT LIKE' : 'LIKE'} ?`)
        params.push(vals[0])
        break
      }
      case 'Between': {
        needVals(2)
        frags.push(`${col} ${not ? 'NOT BETWEEN' : 'BETWEEN'} ? AND ?`)
        params.push(vals[0], vals[1])
        break
      }
      case 'In':
      case 'Any': {
        if (vals.length === 0) {
          // IN () is invalid SQL; short-circuit truth value instead
          frags.push(not ? '(1=1)' : '(1=0)')
          break
        }
        const ph = vals.map(() => '?').join(', ')
        frags.push(`${col} ${not ? 'NOT IN' : 'IN'} (${ph})`)
        params.push(...vals)
        break
      }
      default:
        // Fallback to equality
        needVals(1, 'Equal')
        frags.push(`${col} ${not ? '!=' : '='} ?`)
        params.push(vals[0])
    }
  }

  return {
    clause: frags.length ? `WHERE ${frags.join(' AND ')}` : '',
    params,
  }
}
