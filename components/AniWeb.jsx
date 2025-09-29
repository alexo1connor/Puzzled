import Rive from "@rive-app/react-canvas";
import { Text, View } from "react-native";
let test = "../assets/animations/plane.riv"
export default async function AniWeb() {
  return (
    <View className=" items-center mt-14 px-5">
      <View className="w-full max-w-[900px]">
        <Text className="text-4xl">Welcome Web!</Text>
        <Rive
          src={require(test)}
          stateMachines="State Machine 1"
          style={{ width: 400, height: 400 }}
        />
      </View>
    </View>
  );
}
