# Android

Run `adb shell am start -W -a android.intent.action.VIEW -d "<URL_SCHEME>://<DEEPLINK_HOST><ROUTE>?params=ciaone" <PACKAGE>` command.

Example:

<URL_SCHEME> = pse
<DEEPLINK_SCHEME> = https
<DEEPLINK_HOST> = pse.com
<ROUTE> = /echo
<PACKAGE> = com.floydcrimson.pse

Run `adb shell am start -W -a android.intent.action.VIEW -d "pse://pse.com/echo?params=eyJjcmVkZW50aWFscyI6IlUyRnNkR1ZrWDE5MFNhcCtyTGMyL1N3L3Vpc2w2NzJ4YjY3bHJNQzBPYVhpUS9WdHBobE9TZEp3Z3pKRVhWY3Q6VTJGc2RHVmtYMStGNUpUWFI0Vk9oSGc3T3NiUkJoZ0hsMkFTZFArb2lzSW9LWVo0d3FIWjdpRVF6VnF4blFpQTBLUjZqblFyRDZnaERSQzBLTVBSbWc9PSJ9" com.floydcrimson.pse` command.
