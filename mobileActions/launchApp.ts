import { remote } from "webdriverio";

export async function createSession(platform: string) {
  // const nativeCapabilities = {
  //   platformName: 'Android',
  //   'appium:automationName': 'UiAutomator2',
  //   'appium:deviceName': 'Android',
  //   'appium:appPackage': 'com.anilab.android',
  //   'appium:appActivity': '.ui.activity.MainActivity',
  //   'appium:noReset': false,
  // };

  const simulators = [
  {
    deviceName: 'iPhone 16 Pro',
    platformVersion: '18.6',
  },
  // {
  //   deviceName: 'iPhone 17 Pro Max',
  //   platformVersion: '26.0',
  // }
];

// pick random simulator
const randomIndex = Math.floor(Math.random() * simulators.length);
const chosenSim = simulators[randomIndex];

  const nativeCapabilities = {
    platformName: "iOS",
    "appium:automationName": "XCUITest",
    "appium:deviceName": chosenSim.deviceName,
    "appium:platformVersion": chosenSim.platformVersion,
    "appium:bundleId": "com.apple.Preferences", 
    "appium:noReset": true,
  };

  const mwebCapbilities = {
    platformName: "Android",
    // browserName: 'Chrome',
    "appium:appPackage": "com.android.chrome",
    "appium:appActivity": "com.google.android.apps.chrome.Main",
    "appium:automationName": "UiAutomator2",
    "appium:chromedriverAutodownload": true,
    "appium:noReset": true,
    "appium:fullReset": false,
  };

  let capabilities =
    platform == "native" ? nativeCapabilities : mwebCapbilities;

  const wdOpts = {
    hostname: "localhost",
    port: 4723,
    // logLevel: 'info' as any,
    capabilities,
  };

  const driver = await remote(wdOpts);

  return driver;
}
