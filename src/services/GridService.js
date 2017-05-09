/**
 * Created by redeyed on 5/6/17.
 */
import {DictService} from "./DictService"

export class GridService {

  constructor (gridSize, minLength){
    this.setProps (gridSize, minLength);

  }

  setProps (gridSize, minLength){
    this.gridSize = gridSize;
    this.minLength = minLength;
  }

  findWords(grid) {
    console.log("finding words")

    let wordsFound = [];

    for (let line of grid) {
      for (let cell of line) {
        if (cell.value) {
          let letters = [];
          letters.push(cell);
          let it = this.findWord(grid, letters);
          for (let word of it) {
            wordsFound.push(word);
          }
        }
      }
    }
    return wordsFound;
  }

  findWord = function*(grid, letters) {
    //up
    let curLetter = letters[letters.length - 1];

    let lettersAround = this.findLettersAround(curLetter, grid, letters);
    //console.log("curLetter is ",curLetter.value,  " letters around are", lettersAround.map(l => l.value))

    for (let letter of lettersAround) {
      if (letter && letter.value) {
        let newLetters = letters.slice();
        newLetters.push(letter);

        if (newLetters.length >= this.minLength) {
          //let wordsFound = this.wordsStartingWith(wordStart);
          let {startsWith, isFinal} = this.dictService.wordsStartingWith(newLetters);

          // no words found
          if (!startsWith) {
            //console.log("nothing found starting with ", wordStart,", skipping")
            continue;
          }

          //at least one found
          if (isFinal) {
            yield newLetters;
          }
        }

        yield * this.findWord(grid, newLetters);
      }
    }
  }

  getWordFromArray(letters) {
    return letters.map(letter => letter.value).join("");
  }

  findLetterByCoord(x, y, grid) {
    if (x >= this.gridSize || y >= this.gridSize) {
      return null;
    }

    if (x < 0 || y < 0) {
      return null;
    }

    for (let line of grid) {
      for (let cell of line) {
        if (cell.x === x && cell.y === y) {
          return cell;
        }
      }
    }
  }

  setDict(data) {
    //split on new lines
    var lines = data.data.split('\n');
    this.dictService = new DictService (lines);
  }

  findLettersAround(letter, grid, letters) {
    let directions = [[0, 1], [0, -1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
    let lettersAround = [];

    for (let direction of directions) {
      let adjacentLetter = this.findLetterByCoord(letter.x + direction[0], letter.y + direction[1], grid);

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
}
;


