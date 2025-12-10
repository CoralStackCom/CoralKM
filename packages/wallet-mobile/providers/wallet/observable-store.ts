export abstract class ObservableStore<TSnapshot> {
  private _listeners = new Set<() => void>()
  protected _version = 0 // bump when state changes
  protected _cached_snapshot!: TSnapshot

  /**
   * Subscribe to state changes
   * Added debug logging for subscription tracking
   *
   * @param listener  Listener function to call on state change
   * @returns         Unsubscribe function
   */
  subscribe = (listener: () => void): any => {
    console.debug(
      '[ObservableStore.subscribe] New listener added, total:',
      this._listeners.size + 1
    )
    this._listeners.add(listener)
    return () => {
      console.debug(
        '[ObservableStore.subscribe] Listener removed, total:',
        this._listeners.size - 1
      )
      this._listeners.delete(listener)
    }
  }

  /**
   * Notify all listeners of a state change
   */
  protected _notify() {
    this._version++
    console.debug(
      '[ObservableStore._notify] Notifying',
      this._listeners.size,
      'listeners, version:',
      this._version
    )
    for (const l of this._listeners) l()
  }

  /** React will call this to read current state */
  abstract getSnapshot(): TSnapshot
}
