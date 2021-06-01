# Others

## Schema Generator

Run `node scripts\schema-generator.js <path> --cleaned --sorted` command.

## Webpack Bundle Analyzer

Run `ng build --configuration=prod,it --stats-json` command.

Run `npx webpack-bundle-analyzer www/stats.json` command.


# Custom parameters

## Overwritable

| Name                | Alias                             | Values                                                                                                |
|:--------------------|:----------------------------------|:------------------------------------------------------------------------------------------------------|
| `domain`            | `--domain`, `--dom`               | `localhost`, `localhost-s`, `localhost-android`, `localhost-android-s`                                |
| `country-extra`     | `--country-extra`, `--co-ex`      | [CountryImplementation](../src/countries/common/implementations/countries.implementation.ts)          |
| `environment-extra` | `--environment-extra`, `--env-ex` | [EnvironmentImplementation](../src/environments/common/implementations/environment.implementation.ts) |
| `domain-extra`      | `--domain-extra`, `--dom-ex`      | [DomainImplementation](../src/domains/common/implementations/domains.implementation.ts)               |

## Unoverwritable

| Name          | Alias                    | Values                      |
|:--------------|:-------------------------|:----------------------------|
| `country`     | `--country`, `--co`      | `it`, `en`                  |
| `environment` | `--environment`, `--env` | `dev`, `prod`               |
| `platform`    | `--platform`, `--plt`    | `browser`, `android`, `ios` |


# Browser

Run `node scripts\command-wrapper.js ionic serve -b --configuration=dev,it` command.

Run `node scripts\command-wrapper.js ionic serve -b --configuration=prod,it` command.

Run `node scripts\command-wrapper.js ionic serve -b --configuration=dev,it -- --environment-extra="{ \"enableRouterTracing\": false }"` command.

Run `node scripts\command-wrapper.js ionic serve -b --configuration=dev,it -- --co-ex="{ \"defaultLanguage\": \"en\" }" --env-ex="{ \"enableRouterTracing\": false }"` command.


# Browser on Android (msite)

Run `node scripts\command-wrapper.js ionic serve --external -b --configuration=dev,it -- --domain=localhost-android` command.

Run `node scripts\command-wrapper.js ionic serve --external -b --configuration=prod,it -- --domain=localhost-android` command.

Run `node scripts\command-wrapper.js ionic serve --external -b --configuration=dev,it -- --domain=localhost-android --environment-extra="{ \"enableRouterTracing\": false }"` command.

Run `node scripts\command-wrapper.js ionic serve --external -b --configuration=dev,it -- --dom=localhost-android --env-ex="{ \"enableRouterTracing\": false }"` command.


# Android

Run `node scripts\command-wrapper.js ionic capacitor run android --configuration=dev,it -- --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android` command.

Run `node scripts\command-wrapper.js ionic capacitor run android --configuration=dev,it -- --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android --dom-ex="{ \"url\": \"192.168.1.167\" }"` command.

Run `node scripts\command-wrapper.js ionic capacitor run android -l --external --configuration=dev,it -- --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android` command.

Run `node scripts\command-wrapper.js ionic capacitor run android -l --external --configuration=dev,it -- --env-ex="{ \"enableRouterTracing\": false }" --dom=localhost-android --dom-ex="{ \"url\": \"192.168.1.167\" }"` command.
