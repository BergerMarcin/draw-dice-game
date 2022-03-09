<template>
  <div id="app">
    <AppHeader msg="Guess Your Draw!" />

    <section>
      <button @click="startNewGame">Start New Game</button>
    </section>

    <Round @nextDrawHigher="finalizeRound(choiceType.HIGHER)" @nextDrawLower="finalizeRound(choiceType.LOWER)" />

    <ResultTable />

    <RoundResultModal v-if="modalText" :modalText="modalText" @close-result-modal="handleCloseResultModal" />
  </div>
</template>

<script>
import { diceApiMixin } from "@/mixins/diceApiMixin";
import AppHeader from "@/components/AppHeader.vue";
import Round from "@/components/Round";
import ResultTable from "@/components/ResultTable";
import RoundResultModal from "@/components/RoundResultModal.vue";
import Swal from "sweetalert2";
import { mapState, mapActions, mapGetters } from "vuex";
import { API_ERROR, API_HOST_DRAW_SUFFIX_URIS, CHOICE, CHOICE_POINTS, MAX_ROUNDS } from "@/helpers/constants";

export default {
  name: "App",

  components: { AppHeader, Round, ResultTable, RoundResultModal },

  mixins: [diceApiMixin],

  data: () => ({
    choiceType: CHOICE,
    modalText: "",
  }),

  computed: {
    ...mapState(["results"]),
    ...mapGetters(["areResultsValid", "currentRoundNumber", "currentRoundResult"]),
  },

  async created() {
    this.loadResults();
    if (
    !this.areResultsValid ||
      (this.currentRoundNumber >= MAX_ROUNDS && this.currentRoundResult.draw !== null) ||
      // TODO: use swal
      !confirm("Would you like to continue saved game?")
    ) {
      if (!this.areResultsValid) await this.resetResults();
      await this.startNewGame();
    }
  },

  methods: {
    ...mapActions(["loadResults", "resetResults", "setNewGame", "setNewRound", "updateCurrentRound", "setModalText"]),

    async startNewGame() {
      const draw = await this.drawDice(0);
      const newGame = [{ previousDraw: draw, choice: null, draw: null, points: null }];
      await this.setNewGame({ newGame: newGame });
    },

    async startNewRound() {
      const newRound = { previousDraw: this.currentRoundResult.draw, choice: null, draw: null, points: null };
      await this.setNewRound({ newRound: newRound });
    },

    // finalize round & then start new round || start new game
    async finalizeRound(choice) {
      const draw = await this.drawDice(this.currentRoundResult.previousDraw);
      const points = this.calcPointsOfRound(choice, draw);
      const round = { ...this.currentRoundResult, draw, choice, points };
      await this.updateCurrentRound({ round });

      this.modalText = `Your draw: ${draw}</br></br>Your points: ${points}`;

      if (this.currentRoundNumber < MAX_ROUNDS) {
        await this.startNewRound();
      } else {
        // TODO: use swal
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

    async drawDice(prevDraw) {
      let newDraw = prevDraw;
      while (newDraw === prevDraw) {
        newDraw = await this.getDiceValue(API_HOST_DRAW_SUFFIX_URIS).catch(async (error) => {
          await this.showError(error?.toString().slice(7) || API_ERROR.UNKNOWN.USER_MSG);
          return prevDraw;
        });
      }
      return newDraw;
    },

    handleCloseResultModal() {
      this.modalText = "";
    },

    async showError(msg) {
      return Swal.fire({
        title: "Error Message",
        text: msg,
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    },
  },
};
</script>

<style lang="scss">
@import "scss/base/reset";

body {
  min-height: 100vh;
  padding: 0;
  margin: 0;
  background: $app-background;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;
  overflow-y: auto;
}

section {
  margin-bottom: 50px;
}

h3,
h4 {
  margin: 10px 0;
}

h1 {
  font-size: rem(32px);
}

h3 {
  font-size: rem(24px);
}

h4 {
  font-size: rem(20px);
}

h5 {
  font-size: rem(16px);
}

button {
  @include app-button;
  margin: 5px 20px;
  display: inline;
}
</style>
