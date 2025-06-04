import {
  playStartHangSound,
  playEndHangSound,
  playStartRestSound,
  playEndSetSound,
  playEndTrainingSound,
  playPreparationSound,
  playLastThreeSecondsSound,
} from "@/utils/soundUtils";
import { Button } from "@/components/ui/button";

export default {
  title: "Utils/Sounds",
};

export const SoundsDemo = () => (
  <div className={"grid gap-2 p-6 bg-gray-100 dark:bg-gray-800"}>
    <Button onClick={playStartHangSound}>Play Start Hang Sound</Button>
    <Button onClick={playEndHangSound}>Play End Hang Sound</Button>
    <Button onClick={playStartRestSound}>Play Start Rest Sound</Button>
    <Button onClick={playEndSetSound}>Play End Set Sound</Button>
    <Button onClick={playEndTrainingSound}>Play End Training Sound</Button>
    <Button onClick={playPreparationSound}>Play Preparation Sound</Button>
    <Button onClick={playLastThreeSecondsSound}>
      Play Last Three Seconds Sound
    </Button>
  </div>
);
