export async function generateCrossword(puzzleIn) {
  console.clear();
  let allPuzzleVariants = [];
  let baseWords = puzzleIn.clues.sort(
    (a, b) => b.answer.length - a.answer.length
  );
  for (let baseWord in baseWords) {
    console.log("-----------------Baseword:", baseWords[baseWord]);
    let puzzle = structuredClone(puzzleIn);
    let words = puzzle.clues.sort((a, b) => b.answer.length - a.answer.length);
    let assignedLetters = [];
    let firstWord = words[baseWord];
    console.log("Before:", words);
    words = words.filter((word) => word.answer !== firstWord.answer);
    console.log("After:", words);

    //setup the first word
    for (const letterIndex in firstWord.answer) {
      if (Number(letterIndex) === 0) {
        assignedLetters.push({
          x: Number(letterIndex),
          y: 0,
          direction: "A",
          letter: firstWord.answer[letterIndex],
          clueId: firstWord.id,
        });
      } else {
        assignedLetters.push({
          x: Number(letterIndex),
          y: 0,
          direction: "A",
          letter: firstWord.answer[letterIndex],
        });
      }
    }

    //first pass
    for (let x = 0; x < firstWord.answer.length; x++) {
      let firstWordLetter = firstWord.answer[x];
      console.log("Letter:", firstWordLetter);
      console.log(words);
      for (const wordIndex in words) {
        let word = words[wordIndex].answer;
        console.log("Word:", word);
        let letterFoundInWord = word.indexOf(firstWordLetter);
        if (letterFoundInWord > -1) {
          console.log("Letter Found:", letterFoundInWord);
          let y = letterFoundInWord;
          for (const letterIndex in word) {
            let letter = word[letterIndex];
            if (Number(letterIndex) === 0) {
              assignedLetters.push({
                x: x,
                y: y,
                letter: letter,
                direction: "D",
                clueId: words[wordIndex].id,
              });
              console.log(letter, words[wordIndex].id);
            } else {
              assignedLetters.push({
                x: x,
                y: y,
                direction: "D",
                letter: letter,
              });
            }
            y--;
          }
          words = words.filter((item) => item.answer !== word);
          console.log(words);
          x++;
          break;
        }
      }
    }

    console.log(assignedLetters);

    let max = 0;
    let min = 0;
    for (let letter of assignedLetters) {
      if (letter.y < min) {
        min = letter.y;
      }

      if (letter.y > max) {
        max = letter.y;
      }
    }

    let width = firstWord.answer.length;
    let height = Math.abs(max) + Math.abs(min) + 1;
    console.log(max, min);
    console.log(height, width);
    let size = width;
    if (height > size) {
      size = height;
    }
    console.log(size);
    let finalGrid = Array.from({ length: size * size }, () => " ");

    for (const letter of assignedLetters) {
      console.log(letter.letter, letter.x, letter.y);

      let x = letter.x;
      let y = Math.abs(letter.y - max);
      console.log("After:", letter.letter, x, y);
      let finalNum = Math.abs(letter.x + y * size);
      finalGrid[finalNum] = letter.letter;
      if (letter.letter === "S") {
        console.log(letter.clueId, finalNum);
      }
      if (letter.clueId) {
        let clue = puzzle.clues.find((o) => o.id === letter.clueId);
        console.log(finalNum, letter, clue);
        clue.startCell = finalNum;
        clue.direction = letter.direction;
        console.log(puzzle.clues);
      }
    }
    console.log(finalGrid);
    console.log(puzzle);
    puzzle.gridSize = size;
    puzzle.cells = finalGrid;
    puzzle.variantScore = words.length * size;
    puzzle.firstWord = baseWords[baseWord];
    allPuzzleVariants.push(puzzle);
  }

  allPuzzleVariants = allPuzzleVariants.sort(
    (a, b) => a.variantScore - b.variantScore
  );
  console.log(allPuzzleVariants);
  console.clear();

  return allPuzzleVariants[0];
}
