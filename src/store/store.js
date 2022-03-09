import Vue from "vue";
import Vuex from "vuex";
import { MAX_ROUNDS, SCORE_FRACTION_DIGITS, STORAGE_KEY } from "@/helpers/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    results: [],
  },

  mutations: {
    SET_RESULTS(state, { results }) {
      state.results = results;
    },
    SET_NEW_GAME(state, { newGame }) {
      state.results.push(newGame);
    },
    SET_NEW_ROUND(state, { newRound }) {
      state.results[state.results.length - 1].push(newRound);
    },
    UPDATE_CURRENT_ROUND(state, { round }) {
      const game = state.results.pop();
      game[game.length - 1] = round;
      state.results.push(game);
    },
  },

  actions: {
    loadResults(context) {
      const resultsRead = localStorage.getItem(STORAGE_KEY);
      const results = resultsRead ? JSON.parse(resultsRead) : [];
      context.commit("SET_RESULTS", { results });
    },
    saveResults(context) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context.state.results));
    },
    resetResults(context) {
      context.commit("SET_RESULTS", { results: [] });
      return context.dispatch("saveResults");
    },
    setNewGame(context, { newGame }) {
      context.commit("SET_NEW_GAME", { newGame });
      return context.dispatch("saveResults");
    },
    setNewRound(context, { newRound }) {
      context.commit("SET_NEW_ROUND", { newRound });
      return context.dispatch("saveResults");
    },
    updateCurrentRound(context, { round }) {
      context.commit("UPDATE_CURRENT_ROUND", { round });
      return context.dispatch("saveResults");
    },
  },

  getters: {
    areResultsValid(state) {
      return !!state?.results?.length && !!state.results[state.results.length - 1].length;
    },
    currentGameResults(state, getters) {
      if (!getters.areResultsValid) return [];
      return state.results[state.results.length - 1];
    },
    currentRoundNumber(state, getters) {
      if (!getters.areResultsValid) return -1;
      return getters.currentGameResults.length;
    },
    remainingRoundNumber(state, getters) {
      if (!getters.areResultsValid) return -1;
      return MAX_ROUNDS - getters.currentRoundNumber + 1;
    },
    currentGameScore(state, getters) {
      if (!getters.areResultsValid) return 0;
      return getters.currentGameResults.reduce((sum, res) => res.points + sum, 0).toFixed(SCORE_FRACTION_DIGITS);
    },
    currentRoundResult(state, getters) {
      return getters.areResultsValid ? getters.currentGameResults[getters.currentGameResults.length - 1] : null;
    },
    isDev() {
      return process.env.VUE_APP_DEV_MODE === "true" || false;
    },
  },
});
