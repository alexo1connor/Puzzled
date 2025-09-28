import { Text, View } from "react-native";

export function GameCard({ title, description }) {
  return (
    <View className="bg-blue-500 p-5 shadow-[10px] rounded">
      {/* If Text border looks wrong, wrap it in a View */}
      <View className="">
        <Text className="text-white">{title}</Text>
        <Text className="text-white mt-2">{description}</Text>
      </View>
    </View>
  );
}
