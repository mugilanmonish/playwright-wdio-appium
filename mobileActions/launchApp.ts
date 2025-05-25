import { remote } from "webdriverio";

export async function createSession(platform: string) {

  const nativeCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android',
    'appium:appPackage': 'com.anilab.android',
    'appium:appActivity': '.ui.activity.MainActivity',
    'appium:noReset': false,
  };

  const mwebCapbilities = {
    platformName: 'Android',
    // browserName: 'Chrome',
    'appium:appPackage':'com.android.chrome',
    'appium:appActivity':'com.google.android.apps.chrome.Main',
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverAutodownload': true,
    'appium:noReset': true,
    'appium:fullReset': false
  };

  let capabilities = platform == 'native' ? nativeCapabilities : mwebCapbilities;

  const wdOpts = {
    hostname: 'localhost',
    port: 4723,
    // logLevel: 'info' as any,
    capabilities,
  };

  const driver = await remote(wdOpts);
  return driver;
}