---
id: unit-testing
title: "Test unitaire"
---
Tous les tests sont divisés en trois dossiers:

- `test/unit` - Tests couvrant les fonctions transformant les données de manière non triviale. Ces tests `demandent()` simplement peu de fichiers et exécutent le code qu'ils contiennent, ils sont donc très rapides.
- `test/fonctionnel` - Tests qui lancent une instance verdaccio et effectuent une série de requêtes via http. Ils sont plus lents que les tests unitaires.
- `test/integration` - Tests qui lancent une instance de verdaccio et lui adressent des requêtes à l'aide de npm. Ils sont considérablement lents et peuvent atteindre un registre npm réel. **test non maintenu**

Les tests unitaires et fonctionnels sont effectués automatiquement lorsque vous démarrez `npm test` à partir du dossier racine du projet. Les tests d'intégration doivent être effectués manuellement de temps à autre.

L'on utilise `jest` pour tous les tests.

## Le Script npm

Pour exécuter le script de test, vous pouvez utiliser soit `npm` ou `yarn`.

    yarn run test
    

Cela activera uniquement les deux premiers groupes de test, unité et fonctionnel.

### Utilisation de test/unit

Ce qui suit est juste un exemple de ce à quoi un test unitaire devrait ressembler. Suivez fondamentalement la norme `jest`.

Essayez de décrire ce que fait exactement le test unitaire en une seule phrase dans l'en-tête de la section `test`.

```javacript
const verdaccio = require('../../src/api/index');
const config = require('./partials/config');

describe('basic system test', () => {

  beforeAll(function(done) {
    // something important
  });

  afterAll((done) => {
    // undo something important
  });

  test('server should respond on /', done => {
    // your test
    done();
  });
});
```

### Utilisation de test/functional

Le test fonctionnel de verdaccio présente un niveau de complexité supérieur, qui nécessite une explication détaillée pour garantir une expérience positive.

Tout commence dans le fichier de`index.js`. Plongeons-nous dedans.

```javascript
// we create 3 server instances
 const config1 = new VerdaccioConfig(
    './store/test-storage',
    './store/config-1.yaml',
    'http://localhost:55551/');
  const config2 = new VerdaccioConfig(
      './store/test-storage2',
      './store/config-2.yaml',
      'http://localhost:55552/');
  const config3 = new VerdaccioConfig(
        './store/test-storage3',
        './store/config-3.yaml',
        'http://localhost:55553/');
  const server1: IServerBridge = new Server(config1.domainPath);
  const server2: IServerBridge = new Server(config2.domainPath);
  const server3: IServerBridge = new Server(config3.domainPath);
  const process1: IServerProcess = new VerdaccioProcess(config1, server1, SILENCE_LOG);
  const process2: IServerProcess = new VerdaccioProcess(config2, server2, SILENCE_LOG);
  const process3: IServerProcess = new VerdaccioProcess(config3, server3, SILENCE_LOG);
  const express: any = new ExpressServer();
  ...

    // we check whether all instances has been started, since run in independent processes
    beforeAll((done) => {
      Promise.all([
        process1.init(),
        process2.init(),
        process3.init()]).then((forks) => {
          _.map(forks, (fork) => {
            processRunning.push(fork[0]);
          });
          express.start(EXPRESS_PORT).then((app) =>{
            done();
          }, (err) => {
            done(err);
          });
      }).catch((error) => {
        done(error);
      });
    });

    // after finish all, we ensure are been stoped
    afterAll(() => {
      _.map(processRunning, (fork) => {
        fork.stop();
      });
      express.server.close();
    });


```

### Utilisation

Ici nous allons décrire à quoi devrait ressembler un test fonctionnel typique. Vérifiez inline pour plus d'informations détaillées.

#### The lib/server.js

La classe de serveur est uniquement un wrapper qui simule un client `npm` et fournit une simple API pour les tests fonctionnels.

Comme nous l'avons mentionné dans la section précédente, nous créons 3 serveurs de processus accessibles dans chaque processus, tels que `serveur1`, `serveur2` et `` serveur3`.

En utilisant ces références, vous pourrez envoyer des requêtes à chacune des 3 instances en cours d'exécution.

```javascript
<br />export default function(server) {
  // we recieve any server instance via arguments
  test('add tag - 404', () => {
    // we interact with the server instance.
    return server.addTag('testpkg-tag', 'tagtagtag', '0.0.1').status(404).body_error(/no such package/);
  });
});
```

### Test/integration

Cette section n'a jamais été utilisée, mais nous recherchons de l'aide pour la faire fonctionner correctement. **Toute nouvelle idée est la bienvenue.**