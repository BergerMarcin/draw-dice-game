<template>
  <section class="results">
    <h3>Round Results</h3>
    <div v-if="areResultsValid" class="results__table-container">
      <table>
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
        <tr class="score">
          <td colspan="4">Game Score:</td>
          <td>{{ currentGameScore }}</td>
        </tr>
      </table>
    </div>
    <h4 v-else>Start New Game first!</h4>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "ResultTable",

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

  &__table-container {
    max-width: 100%;
    @include has-min-width("xs") {
      max-width: 80%;
    }

    table {
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 10px 10px $shadow;
    }

    table,
    th,
    td {
      border: 1px solid $gray;
      border-spacing: 1px;
      font-size: 12px;
      @include has-min-width("xs") {
        font-size: 14px;
      }
      @include has-min-width("sm") {
        font-size: inherit;
      }
    }

    th,
    td {
      padding: 2px 5px;
      @include has-min-width("xs") {
        padding: 5px 10px;
      }
    }

    .score {
      font-weight: 700;
    }
  }
}
</style>
