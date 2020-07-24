# SSL generator

https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl

Steps to generate SSL certifiacte (OpenSSL is required):

1. Run `cd global` command.
2. Run `node ssl-generator.js` command.

# Extra

| Parameters                        | Value                                 | Description        |
|:----------------------------------|:--------------------------------------|:---------------------:|
| `--length`                        | `4096`                                | Length of the key     |
| `--days`                          | `365`                                 | Expiring days         |
| `--C`                             | `IT`                                  | Country               |
| `--ST`                            | `Italy`                               | State or province     |
| `--L`                             | `Monza`                               | Locality              |
| `--O`                             | `FloydCrimson`                        | Organization          |
| `--OU`                            | `PSE`                                 | Organizational unit   |
| `--CN`                            | `PSE`                                 | Common name           |
| `--emailAddress`                  | `floyd.crimson.cm@gmail.com`          | Email address         |
