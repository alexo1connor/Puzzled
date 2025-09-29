import { StyleSheet } from "react-native";
import Rive from "rive-react-native";

export default function App() {
  return (
    <Rive
      resourceName="holo_card"
      stateMachineName="cardInteractivity"
      fit="cover"
      autoplay
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
