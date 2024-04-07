import { type Reducer, useEffect, useReducer } from 'react'

type State<T> = {
  data: T | null
  error: Error | null
  loading: boolean
}

type Action<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS",  payload: T }
  | { type: "ERROR",  payload: Error }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true }
    case "SUCCESS":
      return { data: action.payload, error: null, loading: false }
    case "ERROR":
      return { data: null, error: action.payload, loading: false }
    default:
      return state
  }
}

/**
 * Custom hook that handles a promise and its state.
 * @template T The type of data returned by the promise.
 * @param {Promise<T> | (() => Promise<T>)} promise The promise to be handled.
 * @param {any[]} [deps=[]] The dependencies array for the useEffect hook. (Only work if the promise is a function.)
 * @returns {[T, Error | any, boolean]} An array containing the data, error, and loading state.
 */
/**
 * Custom hook that handles a promise and returns the result, error, and loading state.
 * @template T The type of the promise result.
 * @param {Promise<T> | (() => Promise<T>)} promise The promise to be executed or a function that returns the promise.
 * @param {any[]} [deps=[]] The dependencies array for the useEffect hook.
 * @returns {[T, Error | any, boolean]} An array containing the result, error, and loading state.
 *
 * @example
 * const [data, error, loading] = usePromise(fetchData)
 *
 * @example <caption>With dependencies</caption>
 * const [data, error, loading] = usePromise(() => fetchData(id), [id])
 */
export function usePromise<T>(promise: Promise<T> | (() => Promise<T>), deps: any[] = []): [T, Error | any, boolean] {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, {
    data: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    dispatch({ type: "LOADING" });
    (promise instanceof Function ? promise() : promise)
      .then((data) => {
        dispatch({ type: "SUCCESS", payload: data })
      })
      .catch((error) => {
        console.warn(error)
        dispatch({ type: "ERROR", payload: error })
      })
  }, [promise, ...deps])

  return [state.data, state.error, state.loading] as const
}


