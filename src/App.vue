<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { EVENT, STORAGE_KEY } from "./helpers/constants";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    results: [],
    debugMode: true,
  }),

  created() {
    this.results = this.loadResults();
    // TODO: move below code to the component to choose if new game or continue
    // TODO: if
    if (!this.results) this.startNewRound();
  },

  computed: {
    round() {
      if (!this.results?.length || !this.results[this.results.length-1].length) return 0;
      return this.results[this.results.length-1].length;
    },
    score() {
      if (!this.round) return 0;
      return this.results[this.results.length-1].reduce((sum, res) => res.points + sum, 0)
    }
  },

  methods: {
    loadResults() {
      const resStr = localStorage.getItem(STORAGE_KEY);
      const res = resStr ? JSON.stringify(resStr) : [];
      this.debugMsg("log", "Read saved results: ", res);
      return res;
    },
    saveResults(res) {
      if (!res) {
        this.debugMsg("warn", "Results not saved. Results are empty");
        return;
      }
      localStorage.getItem(STORAGE_KEY, JSON.stringify(res));
      this.debugMsg("log", "Saved results: ", res);
      return res;
    },
    startNewRound() {
      const newRound = [{ event: EVENT.START, previousDraw: this.drawDick(), draw: null, choice: null, points: null }];
      this.results.push(newRound);
    },

    addResult(singleRes) {

    },

    drawDick() {
      return Math.floor(Math.random() * 6) + 1;
    },

    debugMsg(logType = "log", ...msg) {
      if (!this.debugMode) return;
      console[logType](...msg);
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
