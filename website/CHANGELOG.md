# @verdaccio/website

## 1.0.1-next-8.0

### Patch Changes

- Updated dependencies [970e0c9]
  - @verdaccio/ui-components@4.0.0-next-8.5

## 6.0.1-next-8.4

### Patch Changes

- Updated dependencies [5a91448]
  - @verdaccio/ui-components@4.0.0-next-8.4

## 6.0.1-next-8.3

### Patch Changes

- Updated dependencies [0225c80]
  - @verdaccio/ui-components@4.0.0-next-8.3

## 6.0.1-next-8.2

### Patch Changes

- Updated dependencies [c4e8875]
- Updated dependencies [409494a]
  - @verdaccio/ui-components@4.0.0-next-8.2

## 6.0.1-next-8.1

### Patch Changes

- Updated dependencies [6a8154c]
  - @verdaccio/ui-components@4.0.0-next-8.1

## 6.0.1-next-8.0

### Patch Changes

- Updated dependencies
  - @verdaccio/ui-components@4.0.0-next-8.0

## 6.0.0

### Major Changes

- 47f61c6: feat!: bump to v7

### Patch Changes

- c31aec8: fix: typo in config docs regarding check_owners
- Updated dependencies [92f1c34]
- Updated dependencies [47f61c6]
- Updated dependencies [10dd81f]
- Updated dependencies [5a77414]
- Updated dependencies [02ba426]
- Updated dependencies [ba53d1e]
- Updated dependencies [3b3cf86]
- Updated dependencies [580319a]
- Updated dependencies [e7ebccb]
- Updated dependencies [c9962fe]
- Updated dependencies [3323599]
- Updated dependencies [96b2857]
- Updated dependencies [5210408]
- Updated dependencies [117eb1c]
  - @verdaccio/ui-components@3.0.0
  - docusaurus-plugin-contributors@2.0.0

## 6.0.0-next-7.9

### Patch Changes

- c31aec8: fix: typo in config docs regarding check_owners
- Updated dependencies [5a77414]
- Updated dependencies [3b3cf86]
- Updated dependencies [96b2857]
  - @verdaccio/ui-components@3.0.0-next-7.9

## 6.0.0-next-7.8

### Patch Changes

- Updated dependencies [10dd81f]
  - @verdaccio/ui-components@3.0.0-next-7.8

## 6.0.0-next-7.7

### Patch Changes

- Updated dependencies [117eb1c]
  - @verdaccio/ui-components@3.0.0-next-7.7

## 6.0.0-next-7.6

### Patch Changes

- Updated dependencies [ba53d1e]
  - @verdaccio/ui-components@3.0.0-next-7.6

## 6.0.0-next-7.5

### Patch Changes

- Updated dependencies [c9962fe]
  - @verdaccio/ui-components@3.0.0-next-7.5

## 6.0.0-next-7.4

### Patch Changes

- Updated dependencies [5210408]
  - @verdaccio/ui-components@3.0.0-next-7.4

## 6.0.0-next-7.3

### Patch Changes

- Updated dependencies [3323599]
  - @verdaccio/ui-components@3.0.0-next-7.3

## 6.0.0-next.2

### Patch Changes

- Updated dependencies [02ba426ce]
- Updated dependencies [580319a53]
- Updated dependencies [e7ebccb61]
  - @verdaccio/ui-components@3.0.0-next.2

## 6.0.0-next.1

### Patch Changes

- Updated dependencies [92f1c34ae]
  - @verdaccio/ui-components@3.0.0-next.1

## 6.0.0-next.0

### Major Changes

- feat!: bump to v7

### Patch Changes

- Updated dependencies
  - docusaurus-plugin-contributors@2.0.0-next.0
  - @verdaccio/ui-components@3.0.0-next.0

## 5.20.2

### Patch Changes

- Updated dependencies [974cd8c19]
- Updated dependencies [351aeeaa8]
- Updated dependencies [7ef599cc4]
- Updated dependencies [7344a7fcf]
- Updated dependencies [ddb6a2239]
- Updated dependencies [999787974]
- Updated dependencies [781ac9ac2]
- Updated dependencies [0dafa9826]
  - @verdaccio/ui-components@2.0.0
  - docusaurus-plugin-contributors@1.0.1

## 5.20.2-6-next.7

### Patch Changes

- Updated dependencies [7344a7fcf]
  - @verdaccio/ui-components@2.0.0-6-next.10

## 5.20.2-6-next.6

### Patch Changes

- Updated dependencies [0dafa982]
  - @verdaccio/ui-components@2.0.0-6-next.9

## 5.20.2-6-next.5

### Patch Changes

- @verdaccio/ui-components@2.0.0-6-next.8

## 5.20.2-6-next.4

### Patch Changes

- Updated dependencies [7ef599cc]
  - @verdaccio/ui-components@2.0.0-6-next.7

## 5.20.2-6-next.3

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/ui-components@2.0.0-6-next.6

## 5.20.2-6-next.2

### Patch Changes

- Updated dependencies [ddb6a223]
  - @verdaccio/ui-components@2.0.0-6-next.5

## 5.20.2-6-next.1

### Patch Changes

- Updated dependencies [781ac9ac]
  - @verdaccio/ui-components@2.0.0-6-next.4

## 5.20.2-6-next.0

### Patch Changes

- @verdaccio/ui-components@2.0.0-6-next.3

## 5.19.2-6-next.0

### Patch Changes

- @verdaccio/ui-components@2.0.0-6-next.2

## 5.18.1-6-next.0

### Patch Changes

- Updated dependencies [99978797]
  - @verdaccio/ui-components@2.0.0-6-next.1

## 5.14.1-6-next.0

### Patch Changes

- Updated dependencies [351aeeaa]
  - docusaurus-plugin-contributors@1.0.1-6-next.0

## 6.0.0-6-next.0

### Major Changes

- 82cb0f2b: feat!: config.logs throw an error, logging config not longer accept array or logs property

  ### 💥 Breaking change

  This is valid

  ```yaml
  log: { type: stdout, format: pretty, level: http }
  ```

  This is invalid

  ```yaml
  logs: { type: stdout, format: pretty, level: http }
  ```

  or

  ```yaml
  logs:
    - [{ type: stdout, format: pretty, level: http }]
  ```

## 6.0.0-6-next.0

### Major Changes

- 000d4374: feat: upgrade to material ui 5

## 5.3.0-6-next.0

### Minor Changes

- f86c31ed: feat: migrate web sidebar endpoint to fastify

  reuse utils methods between packages
