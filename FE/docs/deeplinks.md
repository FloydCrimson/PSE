# Android

Run `adb shell am start -W -a android.intent.action.VIEW -d "<URL_SCHEME>://<DEEPLINK_HOST><ROUTE>?params=ciaone" <PACKAGE>` command.

Example:

<URL_SCHEME> = pse
<DEEPLINK_SCHEME> = https
<DEEPLINK_HOST> = pse.com
<ROUTE> = /echo
<PACKAGE> = com.floydcrimson.pse

Run `adb shell am start -W -a android.intent.action.VIEW -d "pse://pse.com/echo?params=ciaone" com.floydcrimson.pse` command.
