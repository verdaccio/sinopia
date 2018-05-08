---
id: installation
title: "Instalação"
---
Verdaccio is a multiplatform web application. To install it, you need a few prerequisites.

#### Pré-requisitos

1. Node, acima da versão 
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@beta` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` or `yarn`
3. The web interface supports the `Chrome, Firefox, Edge, and IE9` browsers.

## Instação

`verdaccio` must be installed globaly using either of the following methods:

Usando `npm`

```bash
npm install -g verdaccio
```

ou usando `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

### Beta

⚠️⚠️ **Help us to test the version 3.x in order to release a stable version soon. Remember, to do never test with your original storage folder, do always a backup** ⚠️⚠️

If you are an adventurous developer you can use and install the latest beta version, this is a non stable version, I'd recommend only use for testing purporses.

```bash
$ npm install -g verdaccio@beta
```

## Como Usar

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/2.7.4
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about the CLI, please [read the cli section](cli.md).

## Imagem do Docker

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).