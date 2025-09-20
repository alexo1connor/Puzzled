import { useRef, useState } from "react";
import { Button, Pressable, Text, TextInput, View, } from "react-native";

const puzzle = {
  clues: [
    { start: [0, 0], end: [0, 4], direction: "A", text: "First Clue" },
    { start: [0, 0], end: [4, 0], direction: "D", text: "Second Clue" },
  ],
  solution: {
    cells: [
      ["H", "E", "L", "L", "O"],
      ["E", " ", " ", " ", "W"],
      ["L", " ", " ", " ", "S"],
      ["L", " ", " ", " ", "O"],
      ["O", "W", "N", "E", "D"],
    ],
  },
};

let maxRows = puzzle.solution.cells.length;
let maxCols = puzzle.solution.cells[0].length;
let points = [];
for (let clue of puzzle.clues) {
  let start = clue.start;
  let end = clue.end;
  for (let row = start[0]; row <= end[0]; row++) {
    for (let col = start[1]; col <= end[1]; col++) {
      points.push({
        start: start,
        end: end,
        point: `${row},${col}`,
        clue: clue.text,
        direction: clue.direction,
      });
    }
  }
}
puzzle.points = points;

console.log(puzzle);
let lastClicked = "";
let direction = "A";
export default function App() {
  let test = [
    "H",
    "E",
    "L",
    "L",
    "O",
    "E",
    " ",
    " ",
    " ",
    "W",
    "L",
    " ",
    " ",
    " ",
    "S",
    "L",
    " ",
    " ",
    " ",
    "O",
    "O",
    "W",
    "N",
    "E",
    "D",
  ];
  const [values, setValues] = useState(
    Array.from({ length: test.length }, () => "")
  );
  const tileRefs = useRef({});
  const [clue, setClue] = useState("");
  const setItemRef = (index) => (el) => {
    console.log("Setting Ref", index);
    tileRefs.current[index] = el;
  };

  const handleChange = (row, rowIndex, value) => {
    setValues((prevValues) => {
      const updatedValues = [...prevValues];
      console.log(updatedValues[rowIndex]);
      updatedValues[rowIndex] = value.toUpperCase();
      return updatedValues;
    });
  };

  function swithDirection() {
    if (direction === "A") {
      direction = "D";
    } else {
      direction = "A";
    }
  }

  function pointClicked(r, c) {
    let point = `${r},${c}`;
    if (lastClicked[0] === r && lastClicked[1] === c) {
      swithDirection();
    }
    let obj = puzzle.points.find(
      (o) => o.point === point && o.direction === direction
    );
    if (obj) {
      setClue(obj.clue);
    } else {
      setClue("");
    }
    lastClicked = [r, c];
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex items-center">
        <View
          className="p-10 max-w-[1000px]"
        >
          {test.map((row, rowIndex) => (
            <View
              key={rowIndex}
              ref={setItemRef(rowIndex)}
              className=" aspect-square  border border-black"
            >
              <Pressable
                className="border-none rounded-none text-center w-full h-full"
                onPress={() => {}}
              >
                <TextInput
                  value={values[rowIndex]}
                  autoCapitalize="characters"
                  className="border-none rounded-none text-center w-full h-full"
                  onChangeText={(text) => {
                    handleChange(row, rowIndex, text.slice(-1));
                  }}
                />
              </Pressable>
            </View>
          ))}
        </View>
        <Text>{clue}</Text>
        <Button
          title="Test"
          onPress={() => {
            console.log("Refs:", tileRefs);
          }}
        ></Button>
      </View>
    </View>
  );
}
