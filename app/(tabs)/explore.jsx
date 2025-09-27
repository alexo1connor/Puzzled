// CrosswordTab.js
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { generateCrossword } from "../crosswordGen";

const testPuzzle = {
  title: "Crossword Puzzle",
  clues: [
    { id: 1, answer: "PENCIL", text: "A writing tool with a graphite core" },
    { id: 2, answer: "RAINBOW", text: "An arc of colored light in the sky" },
    {
      id: 3,
      answer: "PIZZA",
      text: "A popular Italian dish with a round, flat base",
    },
    { id: 4, answer: "OCEAN", text: "A large body of saltwater" },
    { id: 5, answer: "TIGER", text: "A large, striped feline predator" },
    {
      id: 6,
      answer: "APPLE",
      text: "A common fruit that can be red, green, or yellow",
    },
    { id: 7, answer: "CACTUS", text: "A spiny desert plant" },
  ],
};

const selectedClasses = {
  notSelected: "bg-white",
  selected: "bg-blue-500",
  selectedProxy: "bg-yellow-400",
  null: "bg-black",
};

export default function App() {
  // puzzle starts null until successfully generated
  const [puzzle, setPuzzle] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // gridWidth is a percent number (we'll use inline style width)
  const [gridWidth, setGridWidth] = useState(100);

  // sized after puzzle loads
  const [values, setValues] = useState([]);
  const [tileClasses, setTileClasses] = useState([]);

  const [lastClicked, setLastClicked] = useState(null);
  const [clue, setClue] = useState("");

  const tileRefs = useRef({});
  const directionRef = useRef("A"); // "A" or "D"

  // helper to set ref for TextInput
  const setItemRef = (index) => (el) => {
    tileRefs.current[index] = el;
  };

  // generate puzzle and initialise arrays (defensive)
  async function setPoints() {
    try {
      // avoid global accumulation - local array
      const localPoints = [];

      const puzzleIn = await generateCrossword(testPuzzle);

      console.log(puzzleIn);
      if (!puzzleIn || !Array.isArray(puzzleIn.cells)) {
        throw new Error("generateCrossword returned invalid puzzle");
      }

      // Build points array
      for (let clueObj of puzzleIn.clues || []) {
        const startCell = Number(clueObj.startCell);
        for (let idx = 0; idx < clueObj.answer.length; idx++) {
          let point = startCell;
          if (idx > 0) {
            if (clueObj.direction === "D") {
              point = startCell + idx * puzzleIn.gridSize;
            } else {
              point = startCell + idx;
            }
          }
          localPoints.push({
            clueId: clueObj.id,
            startCell,
            point,
            clue: clueObj.text,
            direction: clueObj.direction,
          });
        }
      }

      const puzzleWithPoints = { ...puzzleIn, points: localPoints };

      // initialize values and tileClasses after we know cell count
      const cellCount = puzzleWithPoints.cells.length;
      setValues(Array.from({ length: cellCount }, () => ""));
      setTileClasses(Array.from({ length: cellCount }, () => "notSelected"));

      // set grid width as percent number (used inline)
      const tilePercentWidth = puzzleWithPoints.gridSize
        ? 100 / puzzleWithPoints.gridSize
        : 100;
      setGridWidth(tilePercentWidth);

      setPuzzle(puzzleWithPoints);
      setLoaded(true);
      console.log("Puzzle generated successfully");
    } catch (err) {
      // release builds will capture this in logcat; surfacing error prevents silent black-screen
      console.error("setPoints error:", err);
      setPuzzle(null);
      setLoaded(false);
    }
  }

  useEffect(() => {
    setPoints();
    return () => {
      tileRefs.current = {};
    };
  }, []);

  const switchDirection = () => {
    directionRef.current = directionRef.current === "A" ? "D" : "A";
  };

  const handleChange = (rowIndex, value) => {
    setValues((prevValues) => {
      const updated = [...prevValues];
      updated[rowIndex] = value ? value.toUpperCase().slice(-1) : "";
      return updated;
    });

    if (!puzzle) return;
    let nextPoint = Number(rowIndex);
    if (directionRef.current === "D") {
      nextPoint += puzzle.gridSize;
    } else {
      nextPoint += 1;
    }

    if (nextPoint >= 0 && nextPoint < puzzle.cells.length) {
      // focus next input if exists
      tileRefs.current[nextPoint]?.focus?.();
    }
  };

  // Consolidated tile classes setter (single update)
  const setTileColours = (selectedPoint, repeatTry = false) => {
    if (!puzzle) return;
    const dir = directionRef.current;
    const selectedPointObj = puzzle.points.find(
      (o) => o.point === selectedPoint && o.direction === dir
    );

    // default all to notSelected
    const nextClasses = Array.from(
      { length: puzzle.cells.length },
      () => "notSelected"
    );

    if (selectedPoint >= 0 && selectedPoint < nextClasses.length) {
      nextClasses[selectedPoint] = "selected";
    }

    if (selectedPointObj) {
      const allCluePoints = puzzle.points.filter(
        (o) => o.clueId === selectedPointObj.clueId
      );
      for (const p of allCluePoints) {
        if (
          p.point >= 0 &&
          p.point < nextClasses.length &&
          p.point !== selectedPoint
        ) {
          nextClasses[p.point] = "selectedProxy";
        }
      }
      setClue(selectedPointObj.clue);
    } else {
      setClue("");
      // if nothing found, flip direction once and try again
      if (!repeatTry) {
        switchDirection();
        return setTileColours(selectedPoint, true);
      }
    }

    setTileClasses(nextClasses);
  };

  const pointClicked = (index, ignoreDirection = false, repeatTry) => {
    if (!ignoreDirection && lastClicked === index) {
      switchDirection();
    }
    if (!ignoreDirection) setLastClicked(index);
    setTileColours(index, false);
  };

  // Render
  if (!loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Crossword Puzzle</Text>

        <Text>Loading....</Text>
        {puzzle === null && (
          <Text selectable className="mt-2 text-sm">
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center">
        <Text>Crossword Puzzle</Text>
        <View className="p-5 mt-5 max-w-[1000px] flex-row flex-wrap w-full">
          {puzzle.cells.map((row, rowIndex) => {
            const isEmpty = row === " ";
            // keep your Tailwind classes; width handled inline using gridWidth percent
            const tileClass = isEmpty
              ? "bg-gray-400 border-gray-700"
              : selectedClasses[tileClasses[rowIndex]] || "bg-white";
            return (
              <View
                key={rowIndex}
                style={{ width: `${gridWidth}%` }}
                className={`aspect-square rounded-none border border-black ${tileClass}`}
              >
                {!isEmpty ? (
                  <Pressable
                    className="flex items-center justify-center border-none rounded-none text-center w-full h-full"
                    onPress={() => {
                      tileRefs.current[rowIndex]?.focus?.();
                      pointClicked(rowIndex);
                    }}
                  >
                    <TextInput
                      ref={setItemRef(rowIndex)}
                      value={values[rowIndex]}
                      caretHidden={true}
                      onFocus={() => pointClicked(rowIndex, true)}
                      contextMenuHidden={true}
                      selectTextOnFocus={false}
                      autoCapitalize="characters"
                      className="absolute text-center w-0 h-0"
                      onChangeText={(text) => {
                        handleChange(rowIndex, text);
                      }}
                    />
                    <Text className="border-none rounded-none text-center align-middle text-lg font-bold">
                      {values[rowIndex]}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
        <Text selectable>{clue}</Text>
      </View>
    </View>
  );
}
