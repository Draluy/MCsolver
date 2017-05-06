/**
 * Created by redeyed on 5/6/17.
 */
export class GridService{

  static dict = [];

  static findWords (grid){
    console.log("finding words")

    for (let line of grid) {
      for (let cell of line) {
        let letters = []
        letters.push(cell);
        findWord(grid, letters);
      }
    }

  }

  static findWords (grid, letters){

  }

  static setDict (data){
    //split on new lines
    var lines = data.data.split('\n');

    for(let line of lines){
      this.dict.push(line);
    }
  }
};

