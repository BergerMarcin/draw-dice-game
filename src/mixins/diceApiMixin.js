import axios from "../plugins/axios-api";
import { API_ERROR } from "@/helpers/constants";
import {mapGetters} from "vuex";

export const diceApiMixin = {
  computed: {
    ...mapGetters(["isDev"])
  },

  methods: {
    getDiceValue(params = []) {
      if (!process.env.VUE_APP_API_HOST) {
        if (this.isDev) console.error(API_ERROR.NO_URL_HOST.DEV_MSG);
        throw new Error(API_ERROR.NO_URL_HOST.USER_MSG);
      }

      let urlWithPathname;
      try {
        urlWithPathname = new URL(process.env.VUE_APP_API_HOST);
        urlWithPathname.pathname = params.join("/");
      } catch (e) {
        if (this.isDev) console.error(API_ERROR.WRONG_URL.DEV_MSG);
        throw new Error(API_ERROR.WRONG_URL.USER_MSG);
      }

      return axios
        .simple("GET", urlWithPathname)
        .then(async (resp) => {
          if (this.isDev) console.log(`Response from ${urlWithPathname}: `, resp);
          if (resp.status !== 200 || !resp.data.success || !resp.data.dice[0]?.value) {
            if (this.isDev) console.error(API_ERROR.WRONG_RESPONSE_STATUS.DEV_MSG);
            throw new Error(API_ERROR.WRONG_RESPONSE_STATUS.USER_MSG);
          } else {
            return resp.data.dice[0].value;
          }
        })
        .catch(() => {
          if (this.isDev) console.error(API_ERROR.GENERAL_RESPONSE_ERROR.DEV_MSG);
          throw new Error(API_ERROR.GENERAL_RESPONSE_ERROR.USER_MSG);
        });
    },
  },
};
