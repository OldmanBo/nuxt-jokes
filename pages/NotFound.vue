<template>
  <div class="page--error">
      <h3>Sorry, we didn't find the page you are looking for</h3>
      <p>Try returning to the <nuxt-link to="/">Home</nuxt-link> page</p>
      <h1>{{$route.name}} 404</h1>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.page--error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
}
.page--error h3 {
    font-size: 4rem;
}
.page--error p {
    font-size: 2rem;
}
.page--error a {
    font-size: 2.5rem;
}
</style>