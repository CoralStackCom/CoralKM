export type Unsubscribe = () => void

/**
 * An abstract observable store that allows subscribing to state changes
 * and notifies listeners when the state changes.
 *
 * @example
 * const store = new MyObservableStore()
 * const snapshot: TSnapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot)
 */
export abstract class ObservableStore<TSnapshot> {
  private _listeners = new Set<() => void>()
  protected _version = 0 // bump when state changes
  protected _cached_snapshot!: TSnapshot

  /**
   * Subscribe to state changes
   *
   * @param listener  Listener function to call on state change
   * @returns         Unsubscribe function
   */
  subscribe = (listener: () => void): Unsubscribe => {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  /**
   * Notify all listeners of a state change
   */
  protected _notify() {
    this._version++
    for (const l of this._listeners) l()
  }

  /** React will call this to read current state */
  abstract getSnapshot(): TSnapshot
}
