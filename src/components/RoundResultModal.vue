<template>
  <transition name="fade" v-if="modalText">
    <div class="modal">
      <div class="modal__mask" @click="onOutsideModalClick">
        <!-- use @click.stop (to stop bubbling to the top of the DOM and stop trigger @click="onOutsideModalClick")-->
        <div class="modal__container" @click.stop="onModalClick">
          <div v-if="shouldDisplayCloseIcon" class="modal__container__icon">
            <span @click="onCloseIconClick">
              <CloseIcon class="modal-icon" />
            </span>
          </div>
          <div v-if="getDiceUrl" class="modal__container__img">
            <img :src="getDiceUrl" alt="Dice" />
          </div>
          <p class="modal__container__text" v-html="modalText" />
          <button @click="onClose">OK</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import CloseIcon from "@/components/svgs/CloseIcon.vue";
import { API_HOST_IMG_SUFFIX_URIS } from "@/helpers/constants";
import { diceApiMixin } from "@/mixins/diceApiMixin";

export default {
  name: "RoundResultModal",

  components: { CloseIcon },

  mixins: [diceApiMixin],

  props: {
    shouldCloseOnOutsideModalClick: { type: Boolean, default: true },
    shouldCloseOnModalClick: { type: Boolean, default: false },
    shouldDisplayCloseIcon: { type: Boolean, default: true },
    modalText: { type: String, default: "" },
  },

  computed: {
    ...mapGetters(["currentRoundResult"]),

    getDiceUrl() {
      const url = this.getDiceImgUrlPath(API_HOST_IMG_SUFFIX_URIS);
      if (!url || this.currentRoundResult.previousDraw === null) return "";
      return `${url}/${this.currentRoundResult.previousDraw}.png`;
    },
  },

  methods: {
    onClose() {
      this.$emit("close-result-modal");
    },

    onOutsideModalClick() {
      if (this.shouldCloseOnOutsideModalClick) this.onClose();
    },

    onModalClick() {
      if (this.shouldCloseOnModalClick) this.onClose();
    },

    onCloseIconClick() {
      if (this.shouldDisplayCloseIcon) this.onClose();
    },
  },
};
</script>

<style lang="scss" scoped>
@include animation-fade(0.5s) {
  opacity: 0;
}

.modal {
  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: brightness(0.9);
  }

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: $modal-color;
    padding: 15px 15px 25px;
    box-shadow: 0 10px 14px $shadow;
    width: 85%;
    @include has-min-width("sm") {
      padding: 20px 20px 35px;
      max-width: 60%;
    }

    &__icon {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      @include has-min-width("sm") {
        margin-bottom: 20px;
      }
    }

    .modal-icon {
      transform: scale(1.3);
      cursor: pointer;
    }

    &__img {
      &::after {
        content: "";
        display: inline-block;
        height: 177px;
      }
    }

    &__text {
      font-size: rem(18px);
      font-weight: 700;
      text-align: center;
      margin: 10px 0 15px;
      @include has-min-width("sm") {
        font-size: rem(24px);
        font-weight: 400;
        margin: 20px 0 20px;
      }
    }
  }
}
</style>
