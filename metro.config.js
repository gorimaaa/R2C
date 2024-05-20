// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;

/*const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);*/
