import { expect, test } from "@playwright/test";
import { createSession } from "../mobileActions/launchApp";
import { tapOnElement, takeScreenshot } from "../mobileActions/perfomActions";
import { LoginPage } from "../pages/login.page";
import { fetchMyDocFromSimulator } from "./fetchFile";

export async function execute(testName: string, platform: string) {
    test(`${testName}`, async ({ page }, testInfo) => {

        await test.step('Launcing Url', async () => {
            await page.goto('https://anilab.to/');
        })

        await test.step('Validating url and title', async () => {
            // await page.waitForEvent('load', { timeout: 120000 });
            const mainPageUrl = await page.url();
            const mainPageTitle = await page.title();
            expect(mainPageTitle).toBe('Anilab - Best Anime App for Android and iOS');
            expect(mainPageUrl).toBe('https://anilab.to/');
        })

        await test.step('Creating wdio driver instance for mobile actions', async () => {
            let driver: WebdriverIO.Browser = await createSession(platform);
            try {
                if (platform == 'native') {
                    // const dontAllowBanner: string = `android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_deny_button")`;
                    // await tapOnElement(driver, dontAllowBanner);

                    // const watchNow: string = `//android.widget.Button[@resource-id="com.anilab.android:id/buttonWatchNow"]`
                    // await tapOnElement(driver, watchNow);

                   
                    // const profileBtn: string = `android=new UiSelector().text("Profile")`;
                    // await tapOnElement(driver, profileBtn);

                    // const continueBtn: string = `android=new UiSelector().resourceId("com.anilab.android:id/buttonContinue")`;
                    // await tapOnElement(driver, continueBtn);

                    // const signUpBtn: string = `android=new UiSelector().resourceId("com.anilab.android:id/textSignUp")`;
                    // await tapOnElement(driver, signUpBtn);

                    // let loginPage: LoginPage = new LoginPage(driver);
                    // await loginPage.login('mugilanmonish@gmail.com', 'jkfhs')

                    // // const errorEle: string = `android=new UiSelector().resourceId("com.anilab.android:id/buttonSignU")`;
                    // // await tapOnElement(driver, errorEle);
                    // const output = await fetchMyDocFromSimulator('List.pdf',driver)
                    await driver.pause(10000)
                    await driver.$('//XCUIElementTypeButton[@name="Save"]').click()
                    await driver.pause(5000)
                    await driver.$('//XCUIElementTypeButton[@name="QLOverlayDoneButtonAccessibilityIdentifier"]').click()
                    // console.log(output);

                } else {
                    await driver.url('https://anilab.to/');
                    await driver.$("//a[@href='#section-downloa' and not(text()='Download')]").click();
                }
            } catch (error) {
                await takeScreenshot(driver, testInfo);
                throw new Error(`${error}`);
            } finally {

                await driver.deleteSession();
            }
        })
    })
}