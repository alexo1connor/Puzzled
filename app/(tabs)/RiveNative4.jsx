import { Platform, StyleSheet } from "react-native";
export default function App() {
  const AniView =
    Platform.OS === "web"
      ? require("../../components/AniWeb").default
      : require("../../components/AniMobile").default;

  console.log("AniView:", AniView);
  return <AniView animationName="blob"/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
