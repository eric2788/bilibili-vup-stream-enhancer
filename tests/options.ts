import type { BackgroundOptions } from "./fixtures/background"
import type { ExtensionOptions } from "./fixtures/base"
import type { ContentOptions } from "./fixtures/content"

export type GlobalOptions = 
    ContentOptions & 
    BackgroundOptions &
    ExtensionOptions