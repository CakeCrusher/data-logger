module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      [
        // 'inline-dotenv'
        "module:react-native-dotenv", {
          "moduleName": "react-native-dotenv",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true,
        }
      ]
    ]
  }
};
