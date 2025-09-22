export function generateCrossword() {
  let words = ["apple", "lemon", "pear", "orange"];
  words = words.sort((a, b) => b.length - a.length);
  console.log(words);
  let grid = [];

  for (let word of words) {
    if (grid.length === 0) {
      for (let i in word) {
        grid.push({ x: Number(i), y: 0, letter: word[i] });
      }
    } else {
      console.log("Word:", word);
      let firstWord = words[0];
      let complete = false;
      for (let firstWordI in firstWord) {
        for (let i in word) {
          if (complete) {
            break;
          }
          let letter = word[i];
          if (letter === firstWord[firstWordI]) {
            console.log(firstWordI, letter, i);
            let tempGrid = [];
            let failed = false;
            let num = Number(i);
            for (let e in word) {
              console.log("Letter:", word[e], e, num);
              if (word[e] !== letter) {
                let tileTakenY = grid.find(
                  (o) => o.x === firstWordI && o.y === num
                );
                let tileTakenX1 = grid.find(
                  (o) => o.x === firstWordI + 1 && o.y === num
                );
                let tileTakenX2 = grid.find(
                  (o) => o.x === firstWordI - 1 && o.y === num
                );
                console.log(tileTakenY, tileTakenX1, tileTakenX2);
                if (!tileTakenY && !tileTakenX1 && !tileTakenX2) {
                  tempGrid.push({
                    x: Number(firstWordI),
                    y: num,
                    letter: word[e],
                  });
                } else {
                  console.log("Fail!!!");
                  failed == true;
                  break;
                }
              }
              num = num - 1;
            }
            if (tempGrid.length > 0 && failed == false) {
              console.log("completed:", word);
              grid = grid.concat(tempGrid);
              complete = true;
              break;
            } else {
              console.log(word, "failed");
            }
            console.log(letter, firstWordI);
          }
        }
      }
    }
  }

  console.log(grid);
  let max = 0;
  let min = 0;
  for (let letter of grid) {
    if (letter.y < min) {
      min = letter.y;
    }

    if (letter.y > max) {
      max = letter.y;
    }
  }

  let width = words[0].length;
  let height = Math.abs(max) + Math.abs(min);
  console.log(max, min);
  console.log(height, width);
  let size = width;
  if (height > size) {
    size = height;
  }
  let finalGrid = Array.from({ length: size }, () => "");
}
