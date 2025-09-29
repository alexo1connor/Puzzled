const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

// add riv to asset extensions
config.resolver.assetExts = [...(config.resolver.assetExts || []), "riv"];

// wrap with nativewind
config = withNativeWind(config, { input: "./global.css" });

module.exports = config;