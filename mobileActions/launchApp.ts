import { remote } from "webdriverio";

export async function createSession() {

  const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android',
    'appium:appPackage': 'com.anilab.android',
    'appium:appActivity': '.ui.activity.MainActivity',
    'appium:noReset': false,
    // 'appium:fullReset': false
  };

  const wdOpts = {
    hostname: 'localhost',
    port: 4723,
    // logLevel: 'info' as any,
    capabilities,
  };

  const driver = await remote(wdOpts);
  return driver;
}