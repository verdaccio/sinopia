module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 10,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    'babel-plugin-dynamic-import-node',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  ignore: ['**/*.d.ts'],
};
