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
        Previous draw: {{ areResultsValid ? currentRoundResult.previousDraw : "Start currentGameResults first!" }}
      </h4>
      <button @click="finalizeRoundAndStartNewRoundOrNewGame(choiceType.HIGHER)" :disabled="!areResultsValid">
        ↑ HIGHER next draw ↑
      </button>
      <button @click="finalizeRoundAndStartNewRoundOrNewGame(choiceType.LOWER)" :disabled="!areResultsValid">
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
import { CHOICE, CHOICE_POINTS, MAX_ROUNDS } from "./helpers/constants";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "App",

  components: {
    AppHeader,
  },

  data: () => ({
    choiceType: CHOICE,
  }),

  computed: {
    ...mapState(["results"]),
    ...mapGetters([
      "areResultsValid",
      "currentGameResults",
      "currentRoundNumber",
      "remainingRoundNumber",
      "currentGameScore",
      "currentRoundResult",
    ]),
  },

  async created() {
    this.loadResults();
    // TODO: move below code to the component to choose if new game or continue and display results underneath; use modal
    if (
      !this.areResultsValid ||
      (this.currentRoundNumber >= MAX_ROUNDS && this.currentRoundResult.draw !== null) ||
      !confirm("Would you like to continue saved game?")
    ) {
      if (!this.areResultsValid) await this.resetResults();
      await this.startNewGame();
    }
  },

  methods: {
    ...mapActions(["loadResults", "resetResults", "setNewGame", "setNewRound", "updateCurrentRound"]),

    async startNewGame() {
      const newGame = [{ previousDraw: this.drawDice(0), choice: null, draw: null, points: null }];
      await this.setNewGame({ newGame: newGame });
    },

    async startNewRound() {
      const newRound = { previousDraw: this.currentRoundResult.draw, choice: null, draw: null, points: null };
      await this.setNewRound({ newRound: newRound });
    },

    async finalizeRoundAndStartNewRoundOrNewGame(choice) {
      const draw = this.drawDice(this.currentRoundResult.previousDraw);
      const points = this.calcPointsOfRound(choice, draw);
      const round = { ...this.currentRoundResult, draw, choice, points };
      await this.updateCurrentRound({ round });

      // TODO: showRoundSummary
      // alert(`Your points: ${points}`);

      if (this.currentRoundNumber < MAX_ROUNDS) {
        await this.startNewRound();
      } else {
        // TODO: showModalNewGame (as below alert is blocking Vuex and no update of state, so on screen no points last round)
        alert("Let's Start New Game!");
        await this.startNewGame();
      }
    },

    calcPointsOfRound(choice, draw) {
      let points = CHOICE_POINTS.WRONG;
      switch (choice) {
        case CHOICE.HIGHER:
          if (draw > this.currentRoundResult.previousDraw) points = CHOICE_POINTS.CORRECT;
          break;
        case CHOICE.LOWER:
          if (draw < this.currentRoundResult.previousDraw) points = CHOICE_POINTS.CORRECT;
          break;
      }
      return points;
    },

    drawDice(prevDraw) {
      let newDraw = prevDraw;
      while (newDraw === prevDraw) {
        newDraw = Math.floor(Math.random() * 6) + 1;
      }
      return newDraw;
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
