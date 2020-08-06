# Custom parameters

WebPack

| Parameters               | Values                                                                 |
|:-------------------------|:-----------------------------------------------------------------------|
| `--country`, `--co`      | `it`, `en`                                                             |
| `--environment`, `--env` | `dev`, `prod`                                                          |
| `--domain`, `--dom`      | `localhost`, `localhost-s`, `localhost-android`, `localhost-android-s` |


Extra

| Parameters                        | Path to model                                                                                         |
|:----------------------------------|:------------------------------------------------------------------------------------------------------|
| `--environment-extra`, `--env-ex` | [EnvironmentImplementation](../src/environments/common/implementations/environment.implementation.ts) |
| `--domain-extra`, `--dom-ex`      | [DomainImplementation](../src/domains/common/implementations/domains.implementation.ts)               |


# Build

node scripts\command-wrapper.js ionic build -- --country=en --environment=dev --environment-extra="{ \\"enableRouterTracing\\": false }" --domain=localhost

npx cap copy

# Browser

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \\"enableRouterTracing\\": false }" --domain=localhost

node scripts\command-wrapper.js ionic serve -b -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost

# Browser on Android (msite)

node scripts\command-wrapper.js ionic serve -b -- --country=en --environment=dev --environment-extra="{ \\"enableRouterTracing\\": false }" --domain=localhost-android

node scripts\command-wrapper.js ionic serve -b -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost-android

# Android

node scripts\command-wrapper.js ionic capacitor run android -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost-android

node scripts\command-wrapper.js ionic capacitor run android -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost-android --dom-ex="{ \\"url\\": \\"10.0.0.7\\" }"

node scripts\command-wrapper.js ionic capacitor run android -l --external -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost-android

node scripts\command-wrapper.js ionic capacitor run android -l --external -- --co=en --env=dev --env-ex="{ \\"enableRouterTracing\\": false }" --dom=localhost-android --dom-ex="{ \\"url\\": \\"10.0.0.7\\" }"

# Extra

| Parameters                        | Value                                  | Description        |
|:----------------------------------|:---------------------------------------|:------------------:|
| `--environment-extra`, `--env-ex` | `"{ \"enableRouterTracing\": false }"` | Disable router log |
| `--domain-extra`, `--dom-ex`      | `"{ \"url\": \"10.0.0.7\" }"`          | Change endpoint    |
