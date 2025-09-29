import Rive from "rive-react-native";

export default function AniMobile() {
  return (
    <Rive
      resourceName="plane"
      stateMachineName="State Machine 1"
      fit="cover"
      autoplay
    />
  );
}
