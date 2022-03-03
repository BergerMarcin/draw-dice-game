<template>
  <section class="round">
    <h3>Draw</h3>
    <h4>Remaining rounds: {{ remainingRoundNumber }}</h4>
    <h4>Previous draw: {{ areResultsValid ? currentRoundResult.previousDraw : "Start currentGameResults first!" }}</h4>
    <button @click="$emit('nextDrawHigher')" :disabled="!areResultsValid">↑ HIGHER next draw ↑</button>
    <button @click="$emit('nextDrawLower')" :disabled="!areResultsValid">↓ LOWER next draw ↓</button>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Round",

  computed: {
    ...mapGetters(["areResultsValid", "currentRoundResult", "remainingRoundNumber"]),
  },
};
</script>

<style lang="scss" scoped>
.round {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
  border: 1px solid grey;
  box-shadow: 0 10px 10px $shadow;
}
</style>
