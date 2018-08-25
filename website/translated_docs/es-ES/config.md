---
id: configuration
title: "Archivo de Configuración"
---
Este archivo es la piedra angular de verdaccio donde puedes modificar su comportamiento por defecto, activar plugins y características externas.

Cuando ejecutas por primera vez ` verdaccio` se crea un archivo de configuración por defecto.

## Configuración por Defecto

La configuración por defecto tiene soporte para paquetes con **enfoque** y permite a los usuarios acceder a todos los paquetes pero solo **a los usuarios autentificados a publicarlos**.

```yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}
```

## Secciones

Las siguientes seciones explican que significa cada propiedad y todas sus diferentes opciones.

### Almacenamiento

Es la localización por defecto del almacenamiento. **Verdaccio esta basado por defecto en archivos locales de sistema**.

```yaml
storage: ./storage
```

### Extensiones

Es la localización del directorio de extensiones. Muy útil para despliegues basados en Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Autentificación

La configuración de autentificación es definida aquí, por defecto la autentificación esta basada en `htpasswd` y es por defecto. Puedes modificar el comportamiento via [extensiones](plugins.md). Para mas información sobre esta sección lee [la página de autentificación](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

Estas propiedades te permiten modificar el aspecto del interfaz web. Para mas información sobre esta sección lea [la página de interfaz web](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplinks

Uplinks es la habilidad del sistema para descargar paquetes de registros remotos cuando dichos paquetes no estan disponibles localmente. Para mas información sobre esta sección lea [la página de uplinks](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Packages

Paquetes te permite controlar como los paquetes van a ser accedidos. Para mas información sobre esta sección lea [la páginas de paquetes](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Configuración Avanzada

### Publicar fuera de línea

Por defecto `verdaccio`no permite publicar cuando el cliente esta fuera de línea, este comportamiento puede ser anulado ajustando esta propiedad a *true*.

```yaml
publish:
  allow_offline: false
```

<small>Desde: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Prefijo URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Max Body Size

By default the maximum body size for a JSON document is `10mb`, if you run in errors as `"request entity too large"` you may increase this value.

```yaml
max_body_size: 10mb
```

### Listen Port

`verdaccio` runs by default in the port `4873`. Changing the port can be done via [cli](cli.md) or in the configuration file, the following options are valid.

```yaml
listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

To enable `https` in `verdaccio` it's enough to set the `listen` flag with the protocol *https://*. For more information about this section read the [ssl page](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxies are special-purpose HTTP servers designed to transfer data from remote servers to local clients.

#### http_proxy and https_proxy

If you have a proxy in your network you can set a `X-Forwarded-For` header using the following properties.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

This variable should contain a comma-separated list of domain extensions proxy should not be used for.

```yaml
no_proxy: localhost,127.0.0.1
```

### Notifications

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Para información detallada sobre configuración, por favor [revise el código fuente](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` is a new command released with [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio includes a built-in middleware plugin to handle this command.

> Si tienes una nueva instalación va incluida por defecto, de otro modo necesitarás añadir las siguientes propiedades a tu archivo config

```yaml
middlewares:
  audit:
    enabled: true
```