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
          let letters = []
          letters.push(cell);
          let it = this.findWord(grid, letters);
          for (let word of it){
            console.log("word found starting with letter ", cell.value, word);
          }
        }
      }
    }

  }

  findWord  = function* (grid, letters){
    //up
    let curLetter =  letters[letters.length - 1];
    let upLetter = this.findLetterByCoord (curLetter.x  , curLetter.y - 1, grid);

    if (upLetter && upLetter.value){
      letters.push(upLetter);
      let wordStart = this.getWordFromArray(letters);
      let wordsFound = this.wordsStartingWith(wordStart);

      // no words found
      if (wordsFound.length === 0){
        console.log("nothing found, returning")
        return;
      }

      //1 only word matches, return
      if (wordsFound.length === 1){
        console.log("found", wordsFound[0]);
        debugger
        yield wordsFound[0];
      }

      //several words match
      console.log("several matches ", wordsFound)
      yield * this.findWord(grid, letters);
    }
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
};


