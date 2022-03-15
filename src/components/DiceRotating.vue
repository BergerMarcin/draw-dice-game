<template>
  <div class="scene">
    <div class="cube" ref="cube">
      <div class="cube__face cube__face--front">front</div>
      <div class="cube__face cube__face--back">back</div>
      <div class="cube__face cube__face--right">right</div>
      <div class="cube__face cube__face--left">left</div>
      <div class="cube__face cube__face--top">top</div>
      <div class="cube__face cube__face--bottom">bottom</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiceRotating",

  data: () => ({
    rotationTimeout: Number,
    cubeElement: HTMLElement,
    rotationX: 0,
    rotationY: 0,
  }),

  mounted() {
    this.cubeElement = this.$refs.cube;
    this.rotationTimeout = setInterval(this.setRandomDiceRotation, 1000);
  },

  beforeDestroy() {
    clearInterval(this.rotationTimeout);
  },

  methods: {
    setRandomDiceRotation() {
      this.cubeElement.style.transform = `translateZ(-100px) rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg)`;
      let deltaRotationX = 0;
      let deltaRotationY = 0;
      while (deltaRotationX === 0 && deltaRotationY === 0) {
        deltaRotationX = Math.round(Math.random() * 3 - 1.5) * 90;
        deltaRotationY = Math.round(Math.random() * 3 - 1.5) * 90;
      }
      this.rotationX += deltaRotationX;
      this.rotationY += deltaRotationY;
    },
  },
};
</script>

<style lang="scss" scoped>
.scene {
  width: 200px;
  height: 200px;
  margin: 20px auto 60px;
  perspective: 600px;
}

.cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  transform: translateZ(-100px);
  transition: transform 1000ms linear;

  &__face {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid black;
    line-height: 200px;
    font-size: 40px;
    font-weight: bold;
    color: white;
    text-align: center;

    &--front {
      background: hsla(0, 100%, 50%, 0.7);
      transform: rotateY(0deg) translateZ(100px);
    }

    &--right {
      background: hsla(60, 100%, 50%, 0.7);
      transform: rotateY(90deg) translateZ(100px);
    }

    &--back {
      background: hsla(120, 100%, 50%, 0.7);
      transform: rotateY(180deg) translateZ(100px);
    }

    &--left {
      background: hsla(180, 100%, 50%, 0.7);
      transform: rotateY(-90deg) translateZ(100px);
    }

    &--top {
      background: hsla(240, 100%, 50%, 0.7);
      transform: rotateX(90deg) translateZ(100px);
    }

    &--bottom {
      background: hsla(300, 100%, 50%, 0.7);
      transform: rotateX(-90deg) translateZ(100px);
    }
  }
}

//.cube.show-front {
//  transform: translateZ(-100px) rotateY(0deg);
//}
//.cube.show-right {
//  transform: translateZ(-100px) rotateY(-60deg) rotateX(-60deg);
//}
//.cube.show-back {
//  transform: translateZ(-100px) rotateY(-180deg);
//}
//.cube.show-left {
//  transform: translateZ(-100px) rotateY(90deg);
//}
//.cube.show-top {
//  transform: translateZ(-100px) rotateX(-90deg);
//}
//.cube.show-bottom {
//  transform: translateZ(-100px) rotateX(90deg);
//}
</style>
