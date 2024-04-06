import type { BackgroundOptions } from "./fixtures/background"
import type { ExtensionOptions } from "./fixtures/extension"
import type { ContentOptions } from "./fixtures/content"
import type { BaseOptions } from "./fixtures/base"

export type GlobalOptions = 
    ContentOptions & 
    BackgroundOptions &
    ExtensionOptions &
    BaseOptions