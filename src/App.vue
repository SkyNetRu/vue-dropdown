<template>
  <div id="app">
    <dropDown />
  </div>
</template>

<script>
  import dropDown from './components/dropDown.vue';

export default {
  name: 'App',
  components: {
    dropDown
  }
}
</script>

<style>
  #app {
  font-family: Proxima Nova;
}
</style>
