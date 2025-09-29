import { StyleSheet } from "react-native";
import Rive from "rive-react-native";

export default function App() {
  return (
    <Rive
      resourceName="plane"
      stateMachineName="State Machine 1"
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
