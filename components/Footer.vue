<template>
  <footer>
      <p>API by: <a href="https://icanhazdadjoke.com/api" target="_blank">icanhazdadjoke</a></p>
  </footer>
</template>

<script>
export default {

}
</script>

<style>
    footer {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 20px 50px;
        background-color: var(--lvl1-green);
        color: #186786;
        font-size: var(--fontTextBig);
    }
    footer a {
        text-decoration: underline;
    }
</style>