<template>
  <div class="hello">
    <h1>The grid</h1>

    <table>
      <tbody>
      <tr v-for="row in values">
        <td v-for="(col, index) in row" @click="tap($event, col)" v-model="row[index]">
          {{col.value}}
        </td>
      </tr>
      </tbody>
    </table>
    <div class="hide"><input id="thehiddeninput" type="text" v-model="userinput"></div>
    <button :disabled="!canSubmit" @click="solve">Solve!</button>

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
        userinput: "",
        selectedModel: null,
        selectedTd: null,
        values: [],
        canSubmit: false
      }
    },
    mounted: function () {
      let values = [];
      for (let i = 0; i < this.gridSize; i++) {
        values[i] = new Array(this.gridSize);

        for (let j = 0; j < this.gridSize; j++) {
          values[i][j] = {"x": j, "y": i, "value": "" };
        }
      }
      this.values = values;

      axios.get('/static/dict.txt')
        .then(response => {
          GridService.setDict(response);
          this.canSubmit = true;
        });
    },
    methods: {
      tap: function (obj, col) {
        let td = obj.target;
        let input = document.querySelector("#thehiddeninput");

        if (!this.selectedTd){
          this.selectedTd = td;
        }

        this.selectedTd.style.backgroundColor = "inherit";
        this.selectedTd = td;
        td.style.backgroundColor = "#FA9";
        this.selectedModel = col;
        input.focus();
      },
      solve : function (evt) {
        GridService.findWords(this.values)
      }
    },
    watch: {
      userinput: function (val, oldVal) {
        if (val) {
          this.selectedModel.value = val;
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
    width: 70vh;
    height: 70vh;
  }

  table td {
    border: solid 2px #CCC;
    width:20%;
    height:20%;
  }

  div.hide {
    width: 0;
    height: 0;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  button{
    font-size: 2em;
    width: 70vh;
  }
</style>
