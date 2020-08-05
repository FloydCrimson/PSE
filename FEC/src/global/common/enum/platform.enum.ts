export enum PlatformEnum {
    Unknown = 0,
    Mobile = 1 << 0,
    Browser = 1 << 1,
    Android = 1 << 2,
    iOS = 1 << 3,
    AndroidMobile = PlatformEnum.Android | PlatformEnum.Mobile,
    AndroidBrowser = PlatformEnum.Android | PlatformEnum.Browser,
    iOSMobile = PlatformEnum.iOS | PlatformEnum.Mobile,
    iOSBrowser = PlatformEnum.iOS | PlatformEnum.Browser
}
