<template>
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
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "Results",

  computed: {
    ...mapState(["results", "modalText"]),
    ...mapGetters(["areResultsValid", "currentGameResults", "currentGameScore"]),
  },
};
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
