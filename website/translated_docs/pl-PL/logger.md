---
id: logger
title: "Rejestrator"
---
Jak każda aplikacja sieci web, verdaccio posiada wbudowany konfigurowalny rejestrator. Możesz określić wiele typów wyjść.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
  # Rotating log stream. Options are passed directly to bunyan. See: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

Use `SIGUSR2` to notify the application, the log-file was rotated and it needs to reopen it. Note: Rotating log stream is not supported in cluster mode. [See here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Konfiguracja

| Property | Type   | Required | Example                                        | Support | Description                                             |
| -------- | ------ | -------- | ---------------------------------------------- | ------- | ------------------------------------------------------- |
| type     | string | No       | [stdout, file]                                 | all     | zdefiniuj wyjście                                       |
| path     | string | No       | verdaccio.log                                  | all     | jeśli typem jest plik, zdefiniuj lokalizację tego pliku |
| format   | string | No       | [pretty, pretty-timestamped]                   | all     | format wyjścia                                          |
| level    | string | No       | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                                           |