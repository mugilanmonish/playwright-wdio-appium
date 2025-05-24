import { Browser, ChainablePromiseElement } from "webdriverio";
import fs from 'fs';
import path from 'path';
import { TestInfo } from "@playwright/test";

export const tapOnElement = async (driver: WebdriverIO.Browser, locator: string) => {

    const element: ChainablePromiseElement = driver.$(locator);

    await element.click();
}

export const takeScreenshot = async (driver: WebdriverIO.Browser, testInfo: TestInfo) => {
    try {
        // Date for timestamp
        const now = new Date();
        const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}-${now.getHours()}_${now.getMinutes()}`

        // Taking screenshot
        const screenshotString = await driver.takeScreenshot();

        // 
        const screenshotDir = path.resolve('./screenshots');

        // check for screenshot folder , if not present - 1st it will automatically create a folder
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }

        // attach png file inside screenshot folder
        const screenshotPath = path.join(screenshotDir, `${testInfo.title}-${timestamp}.png`);
        fs.writeFileSync(screenshotPath, screenshotString, 'base64');
        console.log(`Screenshot captured`);

        // add the mobile screenshot inside playwright html reporter
        await testInfo.attach('Android Native Screenshot', {
            body: Buffer.from(screenshotString, 'base64'),
            contentType: 'image/png',
        });
    } catch (error) {
        console.log(`Failed while taking screenshot`, error)
    }
}