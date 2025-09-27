// scripts/crosswordGen.js

// Safe structuredClone fallback
function deepClone(obj) {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  // fallback (works for plain data - your puzzle appears to be plain objects/arrays)
  return JSON.parse(JSON.stringify(obj));
}

export async function generateCrossword(puzzleIn) {
  try {
    // Small yield so UI can render before heavy work (uncomment to use)
    // await new Promise((res) => setTimeout(res, 0));

    const allPuzzleVariants = [];
    // create a cloned input to avoid mutating caller (use safe fallback)
    const baseWords = (puzzleIn?.clues || [])
      .slice()
      .sort((a, b) => b.answer.length - a.answer.length);

    for (let baseIdx = 0; baseIdx < baseWords.length; baseIdx++) {
      const baseWordObj = baseWords[baseIdx];
      // Use deep clone to avoid mutating original input
      const puzzle = deepClone(puzzleIn);

      // make a sorted copy of words
      let words = (puzzle.clues || []).slice().sort((a, b) => b.answer.length - a.answer.length);

      const assignedLetters = [];
      const firstWord = words[baseIdx];
      // if firstWord is undefined skip
      if (!firstWord) continue;

      // remove the selected first word from the remaining words
      words = words.filter((w) => w.answer !== firstWord.answer);

      // setup the first word horizontally at y = 0
      for (let letterIndex = 0; letterIndex < firstWord.answer.length; letterIndex++) {
        const ch = firstWord.answer[letterIndex];
        assignedLetters.push({
          x: Number(letterIndex),
          y: 0,
          direction: "A",
          letter: ch,
          clueId: Number(letterIndex) === 0 ? firstWord.id : undefined,
        });
      }

      // first pass - try to place other words crossing the first word
      for (let x = 0; x < firstWord.answer.length; x++) {
        const firstWordLetter = firstWord.answer[x];

        let placed = false;
        for (let wi = 0; wi < words.length; wi++) {
          const wobj = words[wi];
          const word = wobj.answer;
          const letterFoundInWord = word.indexOf(firstWordLetter);
          if (letterFoundInWord > -1) {
            // y is starting position on the vertical word
            let y = letterFoundInWord;
            for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
              const letter = word[letterIndex];
              assignedLetters.push({
                x: x,
                y: y,
                direction: "D",
                letter,
                clueId: letterIndex === 0 ? wobj.id : undefined,
              });
              y--;
            }
            // remove the placed word from words
            words = words.filter((item) => item.answer !== word);
            // increment x so next letter placement moves forward (mirrors your original logic)
            placed = true;
            break;
          }
        }
        if (placed) x++; // mirror original behavior
      }

      // compute bounds
      let max = 0;
      let min = 0;
      for (const letter of assignedLetters) {
        if (letter.y < min) min = letter.y;
        if (letter.y > max) max = letter.y;
      }

      let width = firstWord.answer.length;
      let height = Math.abs(max) + Math.abs(min) + 1;
      let size = Math.max(width, height);

      // initialize grid with spaces
      const finalGrid = Array.from({ length: size * size }, () => " ");

      for (const letter of assignedLetters) {
        const x = Number(letter.x);
        const y = Math.abs(letter.y - max);
        const finalNum = Math.abs(x + y * size);
        // guard bounds
        if (finalNum >= 0 && finalNum < finalGrid.length) {
          finalGrid[finalNum] = letter.letter;
          if (letter.clueId) {
            const clue = puzzle.clues.find((o) => o.id === letter.clueId);
            if (clue) {
              clue.startCell = finalNum;
              clue.direction = letter.direction;
            }
          }
        }
      }

      puzzle.gridSize = size;
      puzzle.cells = finalGrid;
      puzzle.variantScore = (words.length || 0) * size;
      puzzle.firstWord = baseWordObj;
      allPuzzleVariants.push(puzzle);
    }

    // choose best variant (lowest score)
    allPuzzleVariants.sort((a, b) => a.variantScore - b.variantScore);

    return allPuzzleVariants[0] || null;
  } catch (err) {
    // Ensure errors show up in release logcat
    console.error("[crosswordGen] generateCrossword error:", err);
    // rethrow so callers can handle it
    throw err;
  }
}
