import { useDefaultHandler } from '~background/forwards';

export type ForwardBody = {
    command: string
    body?: any
}


export default useDefaultHandler<ForwardBody>()