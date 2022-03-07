export const STORAGE_KEY = "draw_dice_results";

/* ---------------- GAME ----------------- */

export const MAX_ROUNDS = 30;

export const CHOICE = {
  HIGHER: "higher",
  LOWER: "lower",
};

export const CHOICE_POINTS = {
  CORRECT: 0.1,
  WRONG: 0,
};

export const SCORE_FRACTION_DIGITS = 1;

/* ---------------- API ----------------- */

export const API_HOST_DRAW_SUFFIX_URIS = ["json", "d6"];

export const API_HOST_IMG_SUFFIX_URIS = ["images", "poorly-drawn", "d6"];

export const API_ERROR = {
  UNKNOWN: {
    DEV_MSG: "Unknown error",
    USER_MSG: 'Please contact HelpDesk (code error "Unknown error")',
  },
  NO_URL_HOST: {
    DEV_MSG: "No host URL, check process.env",
    USER_MSG: "Please contact HelpDesk (code error A1)",
  },
  WRONG_URL: {
    DEV_MSG: "Wrong API URL or pathname",
    USER_MSG: "Please contact HelpDesk (code error A2)",
  },
  WRONG_RESPONSE_STATUS: {
    DEV_MSG: "API response status not valid",
    USER_MSG: "Please contact HelpDesk (code error A3)",
  },
  GENERAL_RESPONSE_ERROR: {
    DEV_MSG: "General API response error",
    USER_MSG: "Please check internet connection",
  },
};
