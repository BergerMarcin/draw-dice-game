<template>
  <BaseSvg :height="13" :name="'close-icon'" :width="14">
    <path
      d="M7.06694 6.4998L1.86694 1.2998M7.06694 6.4998L12.2669 1.2998M7.06694 6.4998L12.2669 11.6998M7.06694 6.4998L1.86694 11.6998"
      stroke="#003F62"
      stroke-width="2"
    />
  </BaseSvg>
</template>

<script>
import BaseSvg from "@/components/BaseSvg.vue";

export default {
  name: "CloseIcon",

  components: { BaseSvg },
};
</script>
