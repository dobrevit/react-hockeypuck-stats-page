export const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: 'current',
      },
    },
  ],
  '@babel/preset-react',
];
export const plugins = ['@babel/plugin-transform-runtime', '@babel/plugin-transform-modules-commonjs'];