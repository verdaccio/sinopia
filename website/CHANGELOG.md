# @verdaccio/website

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
