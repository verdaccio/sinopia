---
id: env
title: Environment Variables
---

Verdaccio provides a set of environment variables to modify either permissions, port or http protocol. Here the complete list:

### Docker {#docker}

To change the behavior on runtime on running the image, these are the list of available variables.

| Variable            | Default          | Description                                        |
| ------------------- | ---------------- | -------------------------------------------------- |
| VERDACCIO_APPDIR    | `/opt/verdaccio` | the docker working directory                       |
| VERDACCIO_USER_NAME | `verdaccio`      | the system user                                    |
| VERDACCIO_USER_UID  | `10001`          | the user id being used to apply folder permissions |
| VERDACCIO_PORT      | `4873`           | the verdaccio port                                 |
| VERDACCIO_PROTOCOL  | `http`           | the default http protocol                          |

### VERDACCIO_HANDLE_KILL_SIGNALS {#handle-kill-signals}

Enables gracefully shutdown, more info at the [pull request #2121](https://github.com/verdaccio/verdaccio/pull/2121).

### VERDACCIO_PUBLIC_URL {#public-url}

Define a specific public url for your server, it overrules the `Host` and `X-Forwarded-Proto` header if a reverse proxy is being used, it takes in account the `url_prefix` if is defined.

This is handy in such situations where a dynamic url is required.

eg:

```
VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/my_prefix'

// url -> https://somedomain.org/my_prefix/

VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/'

// url -> https://somedomain.org/

VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
url_prefix: '/second_prefix'

// url -> https://somedomain.org/second_prefix/'
```

### VERDACCIO_FORWARDED_PROTO {#handle-forwarded-proto}

The default header to identify the protocol is `X-Forwarded-Proto`, but there are some environments which [uses something different](https://github.com/verdaccio/verdaccio/issues/990), to change it use the variable `VERDACCIO_FORWARDED_PROTO`

```
$ VERDACCIO_FORWARDED_PROTO=CloudFront-Forwarded-Proto verdaccio --listen 5000
```

### VERDACCIO_STORAGE_PATH {#storage-path}

By default, the storage is taken from config file, but using this variable allows to set it from environment variable.

### VERDACCIO_STORAGE_NAME

The database name for `@verdaccio/local-storage` is by default `.verdaccio-db.json`, but this can be update by using this variable.

### EXPERIMENTAL_VERDACCIO_LOGGER_COLORS {#logger-colors}

Overrides `logs.colors` from the `config.yaml`.

Note that any value that other than `false` will result in `true`.

When both are not provided - the colors are on by default for TTY processes, and off for processes that are not.
