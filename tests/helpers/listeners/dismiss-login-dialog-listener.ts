import type { PageFrame } from "../page-frame";
import { PageListener } from "./type";

// 监听器：关闭登录对话框
class DismissLoginDialogListener extends PageListener {

    constructor() {
        super('dismiss login dialog listener')
    }

    protected async run(content: PageFrame): Promise<void> {
        const loginDialogDismissButton = content.locator('body > div.bili-mini-mask > div > div.bili-mini-close-icon')
        if (await loginDialogDismissButton.isVisible({ timeout: 500 })) {
            await loginDialogDismissButton.click({ timeout: 500, force: true })
            this.logger.debug('dismissed login dialog')
        }
    }

}

export default DismissLoginDialogListener