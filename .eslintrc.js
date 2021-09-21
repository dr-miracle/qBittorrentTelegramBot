module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  plugins: [
    'promise',
  ],
  rules: {
    'promise/catch-or-return': 2,
    indent: ['warn', 2],
    'no-use-before-define': 0,
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
  },
};
