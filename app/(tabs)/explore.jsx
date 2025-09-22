import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { generateCrossword } from "../../scripts/crosswordGen";

let testPuzzle = {
  title: "Crossword Puzzle",
  clues: [
    {
      id: 1,
      answer: "PENCIL",
      text: "A writing tool with a graphite core",
    },
    {
      id: 2,
      answer: "RAINBOW",
      text: "An arc of colored light in the sky",
    },
    {
      id: 3,
      answer: "PIZZA",
      text: "A popular Italian dish with a round, flat base",
    },
    {
      id: 4,
      answer: "OCEAN",
      text: "A large body of saltwater",
    },
    {
      id: 5,
      answer: "TIGER",
      text: "A large, striped feline predator",
    },
    {
      id: 6,
      answer: "APPLE",
      text: "A common fruit that can be red, green, or yellow",
    },
    {
      id: 7,
      answer: "CACTUS",
      text: "A spiny desert plant",
    },
  ],
};

let points = [];
let direction = "A";

const selectedClasses = {
  notSelected: "bg-white",
  selected: "bg-blue-500",
  selectedProxy: "bg-yellow-400",
  null: "bg-black",
};

export default function App() {
  const [puzzle, setPuzzle] = useState([]);
  const [genSize, setGenSize] = useState([]);
  const [lastClicked, setLastClicked] = useState(false);
  const [gridWidth, setGridWidth] = useState("w-1/7");
  const [values, setValues] = useState(
    Array.from({ length: puzzle?.cells?.length }, () => "")
  );
  const [tileClasses, setTileClasses] = useState(
    Array.from({ length: puzzle?.cells?.length }, () => "notSelected")
  );
  const tileRefs = useRef({});
  const [clue, setClue] = useState("");
  const setItemRef = (index) => (el) => {
    tileRefs.current[index] = el;
  };

  const [loaded, setLoaded] = useState(false);

  async function setPoints() {
    console.log(testPuzzle);
    let puzzleIn = await generateCrossword(testPuzzle);
    console.log(puzzleIn);
    for (let clue of puzzleIn.clues) {
      let cell = clue.startCell;
      for (let index = 0; index < clue.answer.length; index++) {
        let point = cell;
        if (index > 0) {
          if (clue.direction === "D") {
            point += index * puzzleIn.gridSize;
          } else {
            point += index;
          }
        }
        points.push({
          clueId: clue.id,
          startCell: cell,
          point: point,
          clue: clue.text,
          direction: clue.direction,
        });
      }
    }
    puzzleIn.points = points;
    setPuzzle(puzzleIn);
    const tilePercentWidth = puzzleIn?.gridSize ? 100 / puzzleIn.gridSize : 100;

    setGridWidth(tilePercentWidth);
    setLoaded(true);
  }

  const handleChange = (row, rowIndex, value) => {
    setValues((prevValues) => {
      const updatedValues = [...prevValues];
      console.log(updatedValues[rowIndex]);
      updatedValues[rowIndex] = value.toUpperCase();
      return updatedValues;
    });
    let nextPoint = Number(rowIndex);
    let pass = false;
    if (direction === "D") {
      nextPoint += puzzle.gridSize;
      if (nextPoint <= puzzle.cells.length) {
        pass = true;
        console.log("Tile Down", pass);
      }
    } else {
      nextPoint += 1;
      if (
        nextPoint <= puzzle.cells.length &&
        nextPoint % puzzle.gridSize != 0
      ) {
        pass = true;
        console.log("Tile Accross", pass);
      }
    }
    if (pass === true) {
      console.log("Passed");
      console.log(nextPoint, tileRefs.current[Number(nextPoint)]);
      tileRefs.current[Number(nextPoint)]?.focus();
    }
  };

  async function swithDirection() {
    if (direction === "A") {
      direction = "D";
    } else {
      direction = "A";
    }
  }

  async function  setTileColours(selectedPoint, repeatTry) {
    let clueTileFound = false;
    console.log(direction)
    let selectedPointObj = puzzle.points.find(
      (o) => o.point === selectedPoint && o.direction === direction
    );
    setTileClasses((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[selectedPoint] = "selected";
      return updatedValues;
    });
    if (selectedPointObj) {
      let allCluePoints = puzzle.points.filter(
        (o) => o.clueId === selectedPointObj.clueId
      );
      for (let point in puzzle.cells) {
        if (point != selectedPoint) {
          let inClue = allCluePoints.find((o) => o.point === Number(point));
          if (inClue) {
            clueTileFound = true;
            setTileClasses((prevValues) => {
              const updatedValues = [...prevValues];
              updatedValues[point] = "selectedProxy";
              return updatedValues;
            });
          } else {
            setTileClasses((prevValues) => {
              const updatedValues = [...prevValues];
              updatedValues[point] = "notSelected";
              return updatedValues;
            });
          }
        }
      }
    } else {
      for (let point in puzzle.cells) {
        if (point != selectedPoint) {
          setTileClasses((prevValues) => {
            const updatedValues = [...prevValues];
            updatedValues[point] = "notSelected";
            return updatedValues;
          });
        }
      }
    }
    console.log(selectedPoint, selectedPointObj, repeatTry);
    console.log(clueTileFound);
    if (clueTileFound === false && repeatTry !== true) {
      console.log("fired!!!");
      await swithDirection()
      await setTileColours(selectedPoint,true)
    }
  }

  async function pointClicked(index, ignoreDirection, repeatTry) {
    console.log(lastClicked, index, ignoreDirection);
    if (lastClicked === index && ignoreDirection !== true) {
      console.log("Change direction", direction)
      await swithDirection();
    }
    let obj = puzzle.points.find(
      (o) => o.point === index && o.direction === direction
    );
    if (obj) {
      setClue(obj.clue);
    } else {
      setClue("");
    }
    if (!ignoreDirection) {
      setLastClicked(index);
    }
    await setTileColours(index, repeatTry);
  }

  useEffect(() => {
    setPoints();
  }, []);

  if (loaded) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex items-center">
          <View className="p-5 mt-5 max-w-[1000px] flex-row flex-wrap w-full">
            {puzzle.cells.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{ width: `${gridWidth}%` }}
                className={`aspect-square rounded-none border border-black ${gridWidth} 
                ${
                  row === " "
                    ? "bg-gray-400 border-gray-700" + " w-1/"
                    : selectedClasses[tileClasses[rowIndex]]
                } }`}
              >
                {row !== " " ? (
                  <Pressable
                    className="flex items-center justify-center border-none rounded-none text-center w-full h-full"
                    onPress={() => {
                      tileRefs.current[rowIndex].focus();
                      pointClicked(rowIndex);
                    }}
                  >
                    <TextInput
                      ref={setItemRef(rowIndex)}
                      value={values[rowIndex]}
                      caretHidden={true}
                      onFocus={()=> pointClicked(rowIndex,true)}
                      contextMenuHidden={true}
                      selectTextOnFocus={false}
                      autoCapitalize="characters"
                      className="absolute text-center w-0 h-0 "
                      onChangeText={(text) => {
                        handleChange(row, rowIndex, text.slice(-1));
                      }}
                    />
                    <Text className="border-none rounded-none text-center align-middle text-lg font-bold">
                      {values[rowIndex]}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
          </View>
          <Text>{clue}</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Loading....</Text>
    </View>
  );
}
