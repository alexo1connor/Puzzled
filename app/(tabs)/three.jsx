import { Text, View } from "react-native";
import { GameCard } from "../../components/gameCard";
export default function MyList() {
  return (
    <View className=" items-center mt-14 px-5">
      <View className="w-full max-w-[900px]">
        <Text className="text-4xl">Welcome!</Text>
        <View className="flex flex-row gap-3">
          <GameCard
            size="medium"
            title="Crossword Burst"
            description="Play 3 shorter crosswords back to back. Try beat it in the time limit!"
          />
          <GameCard
            size="medium"
            title="Crossword Burst AI"
            description="Create your own Crossword Bursts with AI!"
          />
        </View>
      </View>
    </View>
  );
}
