<template>
  <header class="header">
    <h1>{{ msg }}</h1>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    msg: String,
  },
};
</script>

<style lang="scss" scoped>
header {
  margin: 40px 0 40px;
  text-align: center;
}
</style>
