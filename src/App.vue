<template>
  <div id="app">
    <AppHeader msg="Predict Your Draw!" />

    <section>
      <h3>Start New Game!</h3>
      <button @click="startNewGame">Start New Game</button>
    </section>

    <section>
      <h3>Draw</h3>
      <h4>Remaining rounds: {{ remainingRoundNumber }}</h4>
      <h4>
        Previous draw: {{ areResultsValid ? currentRoundResults.previousDraw : "Start currentGameResults first!" }}
      </h4>
      <button @click="setChoiceAndStartNewRoundOrNewGame(choiceType.HIGHER)" :disabled="!areResultsValid">
        ↑ HIGHER next draw ↑
      </button>
      <button @click="setChoiceAndStartNewRoundOrNewGame(choiceType.LOWER)" :disabled="!areResultsValid">
        ↓ LOWER next draw ↓
      </button>
    </section>

    <section class="results">
      <h3>Round Results</h3>
      <table v-if="areResultsValid" border="1">
        <tr>
          <th scope="col">Round</th>
          <th scope="col">Previous Draw</th>
          <th scope="col">Choice</th>
          <th scope="col">Dice Draw</th>
          <th scope="col">Points</th>
        </tr>
        <tr v-for="(result, index) in currentGameResults" :key="`currentGameResults-result-${index + 1}`">
          <td>{{ index + 1 }}</td>
          <td>{{ result.previousDraw }}</td>
          <td>{{ result.choice !== null ? result.choice : "..." }}</td>
          <td>{{ result.draw !== null ? result.draw : "..." }}</td>
          <td>{{ result.points !== null ? result.points : "..." }}</td>
        </tr>
        <tr>
          <td colspan="4">Game Score:</td>
          <td>{{ currentGameScore }}</td>
        </tr>
      </table>
      <h4 v-else>Start New Game first!</h4>
    </section>
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import {
  STORAGE_KEY,
  CHOICE,
  CHOICE_POINTS,
  SCORE_FRACTION_DIGITS,
  MAX_ROUNDS,
  CONSOLE_TYPE,
} from "./helpers/constants";

export default {
  name: "App",

  components: {
    AppHeader,
  },

  data: () => ({
    results: [],
    choiceType: CHOICE,
    debugMode: true,
  }),

  mounted() {
    this.results = this.loadResults();
    // TODO: move below code to the component to choose if new game or continue and display results underneath; use modal
    if (!this.areResultsValid || this.currentRoundNumber >= MAX_ROUNDS) this.startNewGame();
    else if (confirm("Would you like to continue saved game?")) this.startNewRound();
    else this.startNewGame();
  },

  computed: {
    areResultsValid() {
      return this.results?.length && this.results[this.results.length - 1].length;
    },
    currentGameResults() {
      if (!this.areResultsValid) return [];
      return this.results[this.results.length - 1];
    },
    currentRoundNumber() {
      return this.currentGameResults.length;
    },
    remainingRoundNumber() {
      return MAX_ROUNDS - this.currentRoundNumber + 1;
    },
    currentGameScore() {
      if (!this.areResultsValid) return 0;
      return this.currentGameResults.reduce((sum, res) => res.points + sum, 0).toFixed(SCORE_FRACTION_DIGITS);
    },
    currentRoundResults() {
      return this.areResultsValid ? this.currentGameResults[this.currentGameResults.length - 1] : null;
    },
  },

  methods: {
    loadResults() {
      const resStr = localStorage.getItem(STORAGE_KEY);
      const res = resStr ? JSON.parse(resStr) : [];
      this.debugMsg(CONSOLE_TYPE.LOG, "Read saved results: ", res);
      return res;
    },

    saveResults(res) {
      if (!res) {
        this.debugMsg(CONSOLE_TYPE.WARN, "Results not saved. Results are empty");
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
      this.debugMsg(CONSOLE_TYPE.LOG, "Saved results: ", res);
      return res;
    },

    startNewGame() {
      const newGame = [{ previousDraw: this.drawDick(0), choice: null, draw: null, points: null }];
      // TODO: change below to reactive-way
      this.results.push(newGame);
    },

    startNewRound() {
      if (!this.currentRoundResults) {
        this.debugMsg(CONSOLE_TYPE.ERROR, "Error. No previous round result to start new round");
        return;
      }
      const newRound = { previousDraw: this.currentRoundResults.draw, choice: null, draw: null, points: null };
      // TODO: change below to reactive-way
      this.results[this.results.length - 1].push(newRound);
    },

    setChoiceAndStartNewRoundOrNewGame(choice) {
      if (!Object.values(CHOICE).includes(choice)) {
        this.debugMsg(CONSOLE_TYPE.ERROR, "Wrong choice type. Passed choice: ", choice);
        return;
      }
      const newDraw = this.drawDick(this.currentRoundResults.previousDraw);
      let points = CHOICE_POINTS.WRONG;
      switch (choice) {
        case CHOICE.HIGHER:
          if (newDraw > this.currentRoundResults.previousDraw) points = CHOICE_POINTS.CORRECT;
          break;
        case CHOICE.LOWER:
          if (newDraw < this.currentRoundResults.previousDraw) points = CHOICE_POINTS.CORRECT;
          break;
      }
      // TODO: change below to reactive-way
      const gameIndex = this.results.length - 1;
      const roundIndex = this.results[gameIndex].length - 1;
      this.results[gameIndex][roundIndex].draw = newDraw;
      this.results[gameIndex][roundIndex].choice = choice;
      this.results[gameIndex][roundIndex].points = points;
      this.saveResults(this.results);

      // TODO: if (points === CHOICE_POINTS.CORRECT) showModalCongratulation

      if (this.currentRoundNumber < MAX_ROUNDS) {
        this.startNewRound();
      } else {
        // TODO: showModalNewRoundHasStarted
        alert("Let's Start New Game!");
        this.startNewGame();
      }
    },

    drawDick(prevDraw) {
      let newDraw = prevDraw;
      while (newDraw === prevDraw) {
        newDraw = Math.floor(Math.random() * 6) + 1;
      }
      this.debugMsg(CONSOLE_TYPE.LOG, `New draw: ${newDraw} (previous draw: ${prevDraw})`);
      return newDraw;
    },

    debugMsg(msgType = CONSOLE_TYPE.LOG, ...msg) {
      if (!this.debugMode) return;
      if (!Object.values(CONSOLE_TYPE).includes(msgType))
        console.error(`!!! Wrong message type (${msgType}) for message content: `, ...msg);
      console[msgType](...msg);
    },
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
  overflow-y: auto;
}

section {
  margin-bottom: 50px;
}

h3,
h4 {
  margin: 10px 0;
}

button {
  margin: 5px 20px;
  height: 2rem;
}

.results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
