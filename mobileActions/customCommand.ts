import type { Browser, ChainablePromiseArray, ChainablePromiseElement, Element as WebdriverElement } from 'webdriverio';

export type PlatformLocator = {
  android: string;
  ios: string;
};