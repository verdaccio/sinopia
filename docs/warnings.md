# Warning Codes

## VERWAR001

`Verdaccio doesn't need superuser privileges. Don't run it under root.`

## VERWAR002

`The configuration property "logs" has been deprecated, please rename to "log" for future compatibility`

## VERWAR003

`rotating-file type is not longer supported, consider use [logrotate] instead`

## VERWAR004

`invalid address - %s, we expect a port (e.g. "4873"), host:port (e.g. "localhost:4873") or full url '(e.g. "http://localhost:4873/")`

Learn more at https://verdaccio.org/docs/en/configuration#listen-port

## VERWAR005

`n/a`

## VERWAR006

`the auth plugin method "add_user" in the auth plugin is deprecated and will be removed in next major release, rename to "adduser"`

## VERWAR007

`the secret length is too long, it must be 32 characters long, please consider generate a new one`

Learn more at https://verdaccio.org/docs/configuration/#.verdaccio-db

## VERDEP001

> Changed to VERWAR002 (see above)

## VERDEP002

> After version `verdaccio@6.0.0-6-next.38` this is not longer a warning and will crash your application

## VERDEP003

`multiple addresses will be deprecated in the next major, only use one`
