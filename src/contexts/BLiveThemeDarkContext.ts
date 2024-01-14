import { createContext } from "react";
import type { UseState } from "~types/common";

const BJFThemeDarkContext = createContext<UseState<boolean>>(null)

export default BJFThemeDarkContext