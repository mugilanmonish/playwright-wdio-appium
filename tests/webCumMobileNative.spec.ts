import { test, expect } from '@playwright/test';
import { createSession } from "../mobileActions/launchApp";
import { tapOnElement, takeScreenshot } from "../mobileActions/perfomActions";

test('Anilab - screenshot test', async ({ page }, testInfo) => {
  await page.goto('https://anilab.to/');

  const text = await page.locator('//img[@alt="anilab logo"]/../following-sibling::div[1]').textContent();

  console.log(text);

  let driver: WebdriverIO.Browser = await createSession();;
  try {
    const dontAllowBanner: string = `android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_deny_button")`;
    await tapOnElement(driver, dontAllowBanner);

    const watchNow: string = `//android.widget.Button[@resource-id="com.anilab.android:id/buttonWatchNow"]`
    await tapOnElement(driver, watchNow);

    const profileBtn: string = `android=new UiSelector().text("Profile")`;
    await tapOnElement(driver, profileBtn);

    const continueBtn: string = `android=new UiSelector().resourceId("com.anilab.android:id/buttonContinue")`;
    await tapOnElement(driver, continueBtn);

    const signUpBtn: string = `android=new UiSelector().resourceId("com.anilab.android:id/textSignUp")`;
    await tapOnElement(driver, signUpBtn);

    const errorEle: string = `android=new UiSelector().resourceId("com.anilab.android:id/buttonSignU")`;
    await tapOnElement(driver, errorEle);

  } catch (error) {

    await takeScreenshot(driver, testInfo);
    throw new Error(error);
  } finally {

    await driver.deleteSession();
  }
});