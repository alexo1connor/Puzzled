import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play(); // start animation
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require("../../assets/animations/TestAnimation2.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
