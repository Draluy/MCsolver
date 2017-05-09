<template>
  <div class="hello">
    <h1>The grid</h1>

    <table>
      <tbody>
      <tr v-for="row in values">
        <td v-for="(col, index) in row" @click="tap($event, col)" v-model="row[index]">
          {{col.value}}
          <div class="hide"><input class="invisible" type="text" v-model="userinput"></div>
        </td>
      </tr>
      </tbody>
    </table>

    <button :disabled="!canSubmit" @click="solve">Solve!</button>
    <br/>
    <hr>
    <div v-if="words.length > 0">
      Mots trouves:
      <select>
        <option v-for="word in words">{{word.map(l=>l.value).join("")}}</option>
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
        words: []
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
      let arr = [
       "z",null, null, null, null,
       "i","u", null, null, null,
       "t",null, null, null, null,
       null,null, null, null, null,
       null,null, null, null, null
       ]
       for (let i = 0; i < this.gridSize; i++) {
       for (let j = 0; j < this.gridSize; j++) {
       values[i][j] = {"x": j, "y": i, "value": arr[i*this.gridSize+j]};
       }
       }
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
        let input = td.querySelector("input");

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
        this.words = this.gridService.findWords(this.values);
      },
      setprops: function (evt) {
        this.gridService.setProps(this.gridSize, this.minLength);
      }
    },
    watch: {
      userinput: function (val, oldVal) {
        if (val) {
          this.selectedModel.value = val.toLowerCase();
          this.userinput = "";
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
    width: 0;
    height: 0;
  }

  input.invisible {
    opacity: 0;
    width: 0;
    height: 0;
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
