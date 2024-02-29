import type { PageFrame } from "../page-frame";
import { PageListener } from "./type";

class DismissUserTutorialListener extends PageListener {

    constructor() {
        super('dismiss user tutorial listener')
    }

    protected async run(content: PageFrame): Promise<void> {
        const userTutorialLayer = content.locator('.react-joyride__overlay')
        if (await userTutorialLayer.isVisible({ timeout: 500 })) {
            await content.getByText('跳过').click({ timeout: 500, force: true })
            this.logger.debug('dismissed user tutorial')
        }
    }

}

export default DismissUserTutorialListener