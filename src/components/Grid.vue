<template>
  <div class="hello">
    <h1>The grid</h1>

    <table id="mytab1">
      <tbody>
      <tr v-for="row in values">
        <td v-for="(col, index) in row" @click="tap($event, col)" v-model="row[index]">
          <div class="hide"><input class="invisible" type="text" v-model="userinput"></div>
          {{col.value}}
        </td>
      </tr>
      </tbody>
    </table>

    <button :disabled="!canSubmit" @click="solve">Solve!</button>
    <br/>
    <hr>
    <label for="progress" id="progresslabel">

    </label>
    <progress value="0" max="100" id="progress"></progress>

    <div v-if="words.length > 0">
      Mots trouves:
      <select v-model="selectedWords">
        <option v-bind:value="word" v-for="word in words">{{word.map(w=>w.map(l=>l.value).join("")).join("/")}}</option>
      </select>
    </div>
    <div v-else>
      No results
    </div>
    <hr>
    <label for="minLength">Longueur mini des mots<input id="minLength" type="text" @blur="setprops" v-model="minLength">
    </label><br/>
    <!--label for="gridSize">Taille de la grille<input id="gridSize" type="text" v-model="gridSize"></label-->
  </div>
</template>

<script>
  import {GridService} from "../services/GridService"
  import axios from 'axios';

  export default {

    name: 'grid',
    data () {
      return {
        gridSize: 5,
        minLength: 4,
        userinput: "",
        selectedModel: null,
        selectedTd: null,
        values: [],
        canSubmit: false,
        gridService: null,
        words: [],
        selectedWords: []
      }
    },
    mounted: function () {
      this.gridService = new GridService(this.gridSize, this.minLength);
      let values = [];
      for (let i = 0; i < this.gridSize; i++) {
        values[i] = new Array(this.gridSize);

        for (let j = 0; j < this.gridSize; j++) {
          values[i][j] = {"x": j, "y": i, "value": null};
        }
      }

      //DEBUG
      /*let arr = [
        null, null, null, null, null,
        null, null, null, null, null,
        "i", "b", "i", null, null,
        "t", "a", "a", null, null,
        "e", "t", "d", null, null
      ]
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          values[i][j] = {"x": j, "y": i, "value": arr[i * this.gridSize + j]};
        }
      }*/
      //END DEBUG

      this.values = values;

      axios.get('/static/dict.txt')
        .then(response => {
          this.gridService.setDict(response);
          this.canSubmit = true;
        });
    },

    methods: {
      tap: function (obj, col) {
        let td = obj.target;

        console.log("td.tagName ", td.tagName)
        if (td.tagName != "TD") {
          td = obj.target.parentElement.parentElement;
        }

        console.log("td ", td)
        let input = td.querySelector("input") || obj.target;

        if (!this.selectedTd) {
          this.selectedTd = td;
        }

        this.selectedTd.style.backgroundColor = "inherit";
        this.selectedTd = td;
        td.style.backgroundColor = "#FA9";
        this.selectedModel = col;
        input.focus();
      },
      solve: function (evt) {
        this.canSubmit = false;

        let progress = document.querySelector("#progress");
        let label = document.querySelector("#progresslabel");
        progress.value = 0;


        this.words = this.gridService.findWords(this.values);
        let nbWords = this.words.length;
        progress.value = 1;

        let arrays = [];

        for (let word of this.words) {
          let results = [word];
          let it = this.gridService.findPossibleCombinations(this.values, results);

          for (let arr of it) {
            arrays.push(arr);
          }

          progress.value = progress.value + 100 / nbWords;
        }

        this.words = arrays;


        this.canSubmit = true;
      },
      setprops: function (evt) {
        this.gridService.setProps(this.gridSize, this.minLength);
      }
    },
    watch: {
      userinput: function (val, oldVal) {
        if (val) {
          let input = val.toLowerCase()
          if (input == " ") {
            this.selectedModel.value = null;
          } else {
            this.selectedModel.value = val.toLowerCase();
          }
          this.userinput = "";
        }
      },

      selectedWords: function (val, oldVal) {
        let word = val[0];
        const table = document.getElementById("mytab1");

        for (let i = 0, row; row = table.rows[i]; i++) {
          for (let j = 0, col; col = row.cells[j]; j++) {
            col.style.backgroundColor = "white";
          }
        }
        for (let letter of word) {
          for (let i = 0, row; row = table.rows[i]; i++) {
            for (let j = 0, col; col = row.cells[j]; j++) {
              if (i == letter.y && j == letter.x) {
                col.style.backgroundColor = "#77D";
              }
            }
          }
        }
      }
    }

  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  table {
    margin-left: auto;
    margin-right: auto;
    font-size: 4em;
    border-collapse: collapse;
    width: 50vw;
    height: 50vw;
  }

  table td {
    border: solid 2px #CCC;
    width: 20%;
    height: 20%;
  }

  div.hide {
    height: 0px;
  }

  input.invisible {
    opacity: 0;
    height: 0px;
    display: inline-block;
  }

  button {
    font-size: 2em;
    width: 50vw;
  }

  @media only screen and (max-device-width: 600px) {
    table {
      width: 90vw;
      height: 90vw;
    }

    button {
      width: 90vw;
    }
  }
</style>
