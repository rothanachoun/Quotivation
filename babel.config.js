module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@database': './src/database',
        },
      },
    ],
  ],
};
