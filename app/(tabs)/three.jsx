// components/Animation.js
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import Rive from 'rive-react-native';

/**
 * Cross-platform Rive component that:
 *  - uses @rive-app/react-canvas on web (expects .riv in public folder, referenced by URL)
 *  - uses rive-react-native on iOS/Android (expects .riv bundled via require)
 *
 * IMPORTANT:
 *  - Put web .riv in public/animations/holo_card.riv and use WEB_RIV_PATH.
 *  - Put native .riv (or other asset) under your app's assets and refer with require().
 *  - Install packages:
 *      npm install @rive-app/react-canvas rive-react-native
 *    For native, follow the native install instructions in rive-react-native README (pod install, etc).
 *
 * Usage:
 *  <Animation />
 */
console.clear();
export default function Animation({
  webSrc = require("../../assets/animations/holo_card.riv"),
  nativeSrc = require("../../assets/animations/holo_card.riv"),
  stateMachineName = "cardInteractivity",
  style = { width: 300, height: 300 },
}) {
  const [PlayerComp, setPlayerComp] = useState(null);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (Platform.OS === "web") {
          const mod = await import("@rive-app/react-canvas");
          const Comp = mod.default || mod.Rive || mod.default || null;
          console.log(mod, Comp);
          if (mounted && Comp) {
            setPlayerComp(() => Comp);
            console.log("Set");
          }
        } else {
          const mod = await import("rive-react-native");
          const Comp = mod.default || mod.Rive || mod.RiveView || null;
          console.log("Mobile", mod, Comp);

          if (mounted && Comp) {
            setPlayerComp(() => Comp);
            console.log("Set Mobile");
          }
        }
      } catch (err) {
        console.error("Failed to dynamically load Rive renderer:", err);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!PlayerComp) return;
    if (Platform.OS !== "web") return;
  }, [ready, PlayerComp]);

  // Loading state
  if (!ready) {
    return (
      <View
        style={{
          width: style.width || 300,
          height: style.height || 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  // Fallback if dynamic import failed
  if (!PlayerComp) {
    return (
      <View
        style={{
          width: style.width || 300,
          height: style.height || 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Replace with an Image or static fallback if desired */}
      </View>
    );
  }

  // Render platform-specific props
  if (Platform.OS === "web") {
    // @rive-app/react-canvas expects src to be a URL string accessible by browser
    // and accepts stateMachines prop (string or array).
    const RiveWeb = PlayerComp;
    console.log("Web", RiveWeb);
    return (
      <RiveWeb
        url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
        artboardName="Avatar 1"
        stateMachineName="avatar"
        stateMachines={stateMachineName}
      />
    );
  }

  // Native - rive-react-native usage (best-effort)
  // Many native wrappers accept `src` as a require() or `resourceName` depending on implementation.
  const RiveNative = PlayerComp;
  console.log("Mobile", RiveNative);

  return (
    <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      style={{width: 400, height: 400}}
  />
  );
}
