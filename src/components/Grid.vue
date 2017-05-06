<template>
  <div class="hello">
    <h1>The grid</h1>
    {{msg}}

    <table>
      <tbody>
      <tr v-for="row in values">
        <td v-for="(col, index) in row" @click="tap($event, col)" v-model="row[index]">
          {{col.value}}
          <div class="hide"><input type="text" v-model="userinput"></div>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  export default {

    name: 'grid',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        gridSize: 5,
        userinput: "",
        selectedModel: null
      }
    },
    computed: {
      values: function () {
        let values = [];
        for (let i = 0; i < this.gridSize; i++) {
          values[i] = new Array(this.gridSize);

          for (let j = 0; j < this.gridSize; j++) {
            values[i][j] = {"x": i, "y": j, "value": "" };
          }
        }
        return values;
      }
    },
    methods: {
      tap: function (obj, col) {
        this.selectedModel = col;
        let input = obj.target.querySelector("input");
        input.focus();
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
  }

</style>
