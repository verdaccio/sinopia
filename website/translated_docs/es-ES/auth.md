---
id: authentification
title: "Autenticación"
---
La autenticación esta atada al [plugin](plugins.md) de autenticación que estes usando. Las restricciones de paquetes es manejado por el [maneador de acceso de paquetes](packages.md).

El cliente de autenticación es manejado por el cliente `npm` en su mismo. Una vez has iniciado sesión en la aplicación:

```bash
npm adduser --registry http://localhost:4873
```

Un toquen es generado en el archivo de configuración de `npm` alojado en el folder de usuario de tu máquina. Para mas información sobre `.npmrc`lea [la documentación oficial](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publicar anonimamente

`verdaccio` te permite habilitar publicar de manera anónima, para conseguirlo necesitarás configurar correctamente el [acceso de paquetes](packages.md).

Por ejemplo:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Como se describe en [el ticket #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) hasta la versión de `pm@5.3.0` y todas las versiones menores **no permitirán publicar sin un token**. Sin embargo, `yarn` no tiene esa limitación.

## Htpasswd por defecto

Con el fin de simplificar la instalación, `verdaccio` usa una extensión por defecto basada en ` htpasswd`.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Propiedad | Tipo   | Requerido | Ejemplo    | Soporte | Descripción                                    |
| --------- | ------ | --------- | ---------- | ------- | ---------------------------------------------- |
| file      | string | Si        | ./htpasswd | all     | archivo que aloja las credenciales encriptadas |
| max_users | number | No        | 1000       | all     | limita los usuarios que pueden registrarse     |

En caso que decidas no permiter mas nuevos registros, puedes definir `max_users: -1`.