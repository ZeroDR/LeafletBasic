<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html, body, #app {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  .marker-item{
    color:black;
    font-size:16px;
    border-radius: 3px;
    text-align: center;
  }

  .marker-item-name{
    border:none;
  }

  .marker-item-name>div{
    padding: auto 10px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    border: 1px solid #ddd;
    border-radius: 2px;
    background: rgba(255,255,255,0.8);
  }
</style>
