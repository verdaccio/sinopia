---
id: authentification
title: "Authentification"
---
Les paramètres de la section d’authentification sont étroitement liés au [ plug-in ](plugins.md) "" Auth " que vous utilisez. Les restrictions d'accès aux packages sont également contrôlées via les [ autorisations d'accès aux packages ](packages.md).

Le processus d'authentification du client est géré par `npm` lui-même. Une fois que vous êtes connectés à l'application:

```bash
npm adduser --registry http://localhost:4873
```

Un jeton est généré dans le fichier de configuration `npm` hébergé dans votre répertoire personnel. Pour plus d'informations sur `.npmrc` lire la [documentation officielle](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publication anonyme

`verdaccio` permet d'activer la publication anonyme. Pour utiliser cette fonction, vous devez définir correctement votre [accès au package](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. Cependant `yarn` n'a pas une telle limitation.

## Htpasswd par défaut

Afin de simplifier la configuration, `verdaccio` utiliser un plugin basé sur `htpasswd`. A partir de la version 3.0.x, le [ plugin externe ](https://github.com/verdaccio/verdaccio-htpasswd) est utilisé par défaut. The v2.x version of this package still contains the built-in version of this plugin.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Property  | Type   | Required | Example    | Support | Description                              |
| --------- | ------ | -------- | ---------- | ------- | ---------------------------------------- |
| file      | string | Yes      | ./htpasswd | all     | file that host the encrypted credentials |
| max_users | number | No       | 1000       | all     | set limit of users                       |

In case to decide do not allow user to login, you can set `max_users: -1`.