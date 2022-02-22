<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="name"
    :class="[`svg-${name}`]"
    :viewBox="`0 0 ${width} ${height}`"
    role="presentation"
    :height="`${height}px`"
    :width="`${width}px`"
  >
    <slot />
  </svg>
</template>

<script>
export default {
  name: "BaseSvg",

  props: {
    name: { type: String, require: true },
    width: { type: Number, require: true },
    height: { type: Number, require: true },
  },
};
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
}
</style>
