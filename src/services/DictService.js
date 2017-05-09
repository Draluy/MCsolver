/**
 * Created by redeyed on 5/9/17.
 */
export class DictService {

  constructor (lines){
    this.root = {};

    for (let word of lines){
      this.addWord(word);
    }
  }

  addWord (word) {
    let curNode = this.root;

    for (let [index, letter] of Array.from(word).entries()) {
      this.appendChild(curNode, letter, (index === (word.length - 1)));
      curNode = curNode[letter];
    }
  }

  appendChild(node, value, isFinal){
    let child = node[value];
    if (!child){
      node[value] = {};
    }

    if (node[value].isFinal){
      node[value].isFinal = node[value].isFinal || isFinal;
    }else
    {
      node[value].isFinal = isFinal;
    }
  }

  wordsStartingWith(letters){
    let startsWith = true;

    let curNode = this.root;
    for (let letter of letters) {
      if (!curNode[letter.value]){
        startsWith = false;
        break;
      }
      curNode = curNode[letter.value];
    }

    return {"startsWith" : startsWith, "isFinal" : curNode.isFinal};
  }
}
