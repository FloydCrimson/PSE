# Custom parameters

WebPack

| Parameters      | Values                                                                 |
|:---------------:|:----------------------------------------------------------------------:|
| `--country`     | `it`, `en`                                                             |
| `--environment` | `dev`, `prod`                                                          |
| `--domain`      | `localhost`, `localhost-s`, `localhost-android`, `localhost-android-s` |


Extra

| Parameters            | Path to model                                                                                         |
|:---------------------:|:-----------------------------------------------------------------------------------------------------:|
| `--environment-extra` | [EnvironmentImplementation](FE\src\environments\common\implementations\environment.implementation.ts) |
| `--domain-extra`      | [DomainImplementation](FE\src\domains\common\implementations\domains.implementation.ts)               |


# Browser

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost

# Browser on Android (msite)

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost-android

# Android

node scripts\command-wrapper.js ionic cordova run android -l -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost-android
