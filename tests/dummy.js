import { remote } from 'webdriverio';

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.anilab.android',
  'appium:appActivity': '.ui.activity.MainActivity',
};

const wdOpts = {
  hostname: 'localhost',
  port: 4723,
//   logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    const batteryItem = await driver.$('//*[@text="Battery"]');
    await batteryItem.click();
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);

try {
  console.error('Hi')
  throw new Error('I am from try')
} catch (error) {
  console.log('Catch');
  throw new Error(error)
} finally {
  console.log('Finally');
}