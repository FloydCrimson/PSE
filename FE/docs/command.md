# Custom parameters

WebPack

| Parameters               | Values                                                                 |
|:------------------------:|:----------------------------------------------------------------------:|
| `--country`, `--co`      | `it`, `en`                                                             |
| `--environment`, `--env` | `dev`, `prod`                                                          |
| `--domain`, `--dom`      | `localhost`, `localhost-s`, `localhost-android`, `localhost-android-s` |


Extra

| Parameters                        | Path to model                                                                                         |
|:---------------------------------:|:-----------------------------------------------------------------------------------------------------:|
| `--environment-extra`, `--env-ex` | [EnvironmentImplementation](FE\src\environments\common\implementations\environment.implementation.ts) |
| `--domain-extra`, `--dom-ex`      | [DomainImplementation](FE\src\domains\common\implementations\domains.implementation.ts)               |


# Browser

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost
node scripts\command-wrapper.js ionic serve -b -- --co=en --env=dev --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost

# Browser on Android (msite)

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost-android
node scripts\command-wrapper.js ionic serve -b -- --co=en --env=dev --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android

# Android

node scripts\command-wrapper.js ionic cordova build android -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost-android
node scripts\command-wrapper.js ionic cordova build android -- --co=en --env=dev --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android

node scripts\command-wrapper.js ionic cordova run android -l -- --country=en --environment=dev --environment-extra="{ \"enableRouterTracing\": false }" --domain=localhost-android
node scripts\command-wrapper.js ionic cordova run android -l -- --co=en --env=dev --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android
