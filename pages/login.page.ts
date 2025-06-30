import type { PlatformLocator } from '../mobileActions/customCommand';

export class LoginPage {
    private driver: WebdriverIO.Browser;

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }
    
  private usernameField = {
    android: 'android=new UiSelector().resourceId("com.anilab.android:id/editEmail")',
    ios: '**/XCUIElementTypeTextField[`name == "username"`]',
  };

  private passwordField = {
    android: 'android=new UiSelector().resourceId("com.anilab.android:id/editPassword")',
    ios: '**/XCUIElementTypeSecureTextField[`name == "password"`]',
  };

  private loginBtn = {
    android: '~login',
    ios: '**/XCUIElementTypeButton[`label == "Login"`]',
  };

  private getSelector(locator: PlatformLocator): string {
    const isAndroid = this.driver.capabilities.platformName?.toString().toLowerCase() === 'android';
    console.log(`PLATFORM -> ${isAndroid}`);
    return isAndroid ? locator.android : locator.ios;
  }

  async login(username: string, password: string): Promise<void> {
    await this.driver.$(this.getSelector(this.usernameField)).setValue(username);
    await this.driver.$(this.getSelector(this.passwordField)).setValue(password);
    await this.driver.$(this.getSelector(this.loginBtn)).click();
  }
}