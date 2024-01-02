import { Spinner } from "@material-tailwind/react"
import { useEffect, useReducer } from "react"

export type PromiseSuspenseProps<T> = {
    promise: Promise<T>
    fallback?: JSX.Element
    children: (data: T) => JSX.Element
    onError?: (error: any) => void
}

const defaultLoading = (
    <div className="flex items-center justify-center ">
        <Spinner />
    </div>
)

type State<T> = { data?: T, error?: any };
type Action<T> = { type: 'resolve', data: T } | { type: 'reject', error: any };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
    console.info('received: ', state, action)
    switch (action.type) {
        case 'resolve':
            return { data: action.data };
        case 'reject':
            return { error: action.error };
        default:
            throw new Error();
    }
}

function PromiseSuspense<T>(props: PromiseSuspenseProps<T>): JSX.Element {
    const { promise, fallback, children, onError } = props
    const [state, dispatch] = useReducer(reducer<T>, {});

    useEffect(() => {
        promise
            .then(data => dispatch({ type: 'resolve', data }))
            .catch(error => {
                dispatch({ type: 'reject', error });
                if (onError) {
                    onError(error);
                }
            });
    }, [promise, onError]);

    if (state.error) {
        return <div className="text-red-500 font-semibold">Error: {state.error.message}</div>
    }

    console.info('data: ', state.data)

    return state.data ? children(state.data) : fallback ?? defaultLoading
}

export default PromiseSuspense