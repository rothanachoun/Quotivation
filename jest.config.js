module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|nanoid|query-string|decode-uri-component|filter-obj|split-on-first|escape-string-regexp)/)',
  ],
};
