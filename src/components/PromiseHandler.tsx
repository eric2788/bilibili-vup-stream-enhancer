import { Spinner, Typography } from "@material-tailwind/react"
import { createContext, useContext, useEffect } from "react"
import { usePromise } from "~hooks/promise"
import { findStaticComponent } from "~utils/react-node"

const ErrorContext = createContext<Error | any>(null)
const PromiseHandlerContext = createContext<unknown>(null)


export type PromiseHandlerProps<T> = {
    promise: Promise<T> | (() => Promise<T>)
    fallback?: JSX.Element
    error?: (error: Error | any) => JSX.Element
    children: React.ReactNode
}

function DefaultErrorMessage({ error }: { error: Error | any }): JSX.Element {

    useEffect(() => {
        console.warn('Error while fetching promise: (Caught from PromiseHandler)')
        console.warn(error)
    }, [error])

    return (
        <div className="flex justify-center items-center text-center max-w-full max-h-full">
            <div className="text-red-500">
                <Typography variant="h5" color="red" className="semi-bold">加载错误:</Typography>
                <span className="text-[17px]">{error.message}</span>
            </div>
        </div>
    )
}

function DefaultLoading(): JSX.Element {
    return (
        <div className="flex justify-center items-center max-w-full max-h-full">
            <Spinner />
        </div>
    )
}


/**
 * Custom hook to access the promise context.
 * @returns The promise context value.
 * @template T - The type of the promise context value.
 */
export function usePromiseContext<T>(): T {
    const context = useContext(PromiseHandlerContext) as T
    return context
}

/**
 * `PromiseHandler` is a React component that handles the state of a promise and renders different content based on that state.
 *
 * @param {Object} props - The properties of the component.
 * @param {Promise<T> | (() => Promise<T>)} props.promise - The promise to handle. This can be a promise or a function that returns a promise.
 * @param {JSX.Element} [props.fallback] - The content to render while the promise is loading. If not provided, a default loading spinner is rendered.
 * @param {(error: any) => JSX.Element} [props.error] - The content to render when the promise is rejected. If not provided, a default error message is rendered.
 * @param {React.ReactNode} props.children - The content to render when the promise is fulfilled.
 *
 * @returns {React.ReactNode} A React node that renders different content based on the state of the promise.
 *
 * @example 
 * // Basic Usage
 * function MyComponent() {
 *   const myPromise = fetch('/api/data').then(response => response.json());
 *
 *   return (
 *     <PromiseHandler 
 *       promise={myPromise} 
 *       fallback={<div>Loading...</div>} 
 *       error={(error) => <div>Error: {error.message}</div>}
 *     >
 *       <MyCustomResponse />
 *     </PromiseHandler>
 *   );
 * };
 * 
 * // Then in MyCustomResponse
 * import { usePromiseContext } from './PromiseHandler';
 * 
 * function MyCustomResponse() {
 *   const data = usePromiseContext();
 *   return <div>My data: {data}</div>;
 * }
 * 
 * @example
 * // With Static Components
 * function MyComponent() {
 *   const myPromise = fetch('/api/data').then(response => response.json());
 *   return (
 *     <PromiseHandler promise={myPromise}>
 *       <PromiseHandler.Loading>
 *         <div style={{ padding: '10px' }}>Loading...</div>
 *       </PromiseHandler.Loading>
 *       <PromiseHandler.Error>
 *         {(error) => <div style={{ padding: '10px' }}>Error: {error.message}</div>}
 *       </PromiseHandler.Error>
 *       <PromiseHandler.Response>
 *         {(data) => <div style={{ padding: '10px' }}>My data: {data}</div>}
 *       </PromiseHandler.Response>
 *     </PromiseHandler>
 *   );
 * }
 */
function PromiseHandler<T>(props: PromiseHandlerProps<T>): React.ReactNode {

    const [data, error, loading] = usePromise<T>(props.promise)

    if (loading) {

        if (props.fallback) {
            return props.fallback
        }

        const customLoading = findStaticComponent(props.children, 'CustomLoading')
        if (customLoading) {
            return customLoading
        }

        return <DefaultLoading />

    }

    if (error) {

        if (props.error) {
            return props.error(error)
        }

        const customError = findStaticComponent(props.children, 'CustomError')
        if (customError) {
            return (
                <ErrorContext.Provider value={error}>
                    {customError}
                </ErrorContext.Provider>
            )
        }

        return <DefaultErrorMessage error={error} />
    }

    const customResponse = findStaticComponent(props.children, 'EmbedRender') ?? props.children

    return (
        <PromiseHandlerContext.Provider value={data}>
            {customResponse}
        </PromiseHandlerContext.Provider>
    )

}

function CustomLoading({ children }: { children: React.ReactNode }): React.ReactNode {
    return children
}

function CustomError({ children }: { children: (err: Error | any) => React.ReactNode }): React.ReactNode {
    const error = useContext(ErrorContext)
    if (!error) return null
    return children(error)
}

function EmbedRender({ children }: { children: (data: any) => React.ReactNode }): React.ReactNode {
    const data = useContext(PromiseHandlerContext)
    return children(data)
}


PromiseHandler.Loading = CustomLoading
PromiseHandler.Error = CustomError
PromiseHandler.Response = EmbedRender

export default PromiseHandler