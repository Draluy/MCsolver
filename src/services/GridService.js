/**
 * Created by redeyed on 5/6/17.
 */
export class GridService{

  dict = [];

  findWords (grid){
    console.log("finding words")

    for (let line of grid) {
      for (let cell of line) {
        if(cell.value) {
          let letters = [];
          letters.push(cell);
          console.log("FINDING WORD STARTING WITH ", cell.value)
          let it = this.findWord(grid, letters);
          for (let word of it){
            console.log("WORD FOUND STARTING WITH ", cell.value, word);
          }
        }
      }
    }

  }

  findWord  = function* (grid, letters){
    //up
    let curLetter =  letters[letters.length - 1];

    let lettersAround = this.findLettersAround (curLetter, grid, letters);
    //console.log("curLetter is ",curLetter.value,  " letters around are", lettersAround.map(l => l.value))

    for (let letter of lettersAround){
      if (letter && letter.value){
        //console.log("adding letter ", letter.value, "to the array")
        let newLetters = letters.slice();
        newLetters.push(letter);
        let wordStart = this.getWordFromArray(newLetters);
        let wordsFound = this.wordsStartingWith(wordStart);

        // no words found
        if (wordsFound.length === 0){
          //console.log("nothing found starting with ", wordStart,", skipping")
          continue;
        }

        //several words match: remove from
        if (this.containsExactly(wordsFound, wordStart)){
          yield wordStart;
        }

        yield * this.findWord(grid, newLetters);
      }
    }
  }

  containsExactly(wordsFound, wordStart) {
    return wordsFound.filter(word => word == wordStart).length > 0;
  }

  wordsStartingWith(wordStart){
    return this.dict.filter(word => word.startsWith(wordStart));
  }

  getWordFromArray(letters){
    return letters.map(letter => letter.value).join("");
  }

  findLetterByCoord(x, y, grid) {
    if (x >= 5 || y >=5){
      return null;
    }

    if (x < 0 || y < 0){
      return null;
    }

    for (let line of grid){
      for (let cell of line){
        if (cell.x === x && cell.y === y){
          return cell;
        }
      }
    }
  }

  setDict (data){
    //split on new lines
    var lines = data.data.split('\n');

    for(let line of lines){
      this.dict.push(line);
    }
  }

  findLettersAround (letter, grid, letters) {
    let directions = [[0,1], [0,-1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]];
    let lettersAround = [];

    for (let direction of directions){
      let adjacentLetter = this.findLetterByCoord (letter.x + direction[0] , letter.y + direction[1], grid);

      if (adjacentLetter && adjacentLetter.value) {
        let letterInList = this.isLetterInList(letters, adjacentLetter);
        //console.log("has letter ", adjacentLetter.value, " been in ", letters.map(l=>l.value), " = ", letterInList)
        if (!letterInList) {
          lettersAround.push(adjacentLetter);
        }
      }
    }
    return lettersAround;
  }

  isLetterInList(letters, adjacentLetter) {
    return !!letters.find(letter => letter.x == adjacentLetter.x && letter.y == adjacentLetter.y);
  }
};


