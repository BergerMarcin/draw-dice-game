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
h1 {
  margin: 40px 0 50px;
}
</style>
