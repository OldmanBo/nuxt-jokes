<template>
    <header>
        <nuxt-link class="header_link" :to="{ name: 'index' }">Home</nuxt-link>
        <nuxt-link class="header_link" :to="{ name: 'Jokes' }">Jokes</nuxt-link>
    </header>
</template>

<script>
export default {

}
</script>

<style>
:root {
  --lvl1-green: #F0F7D4;
  --lvl2-green: #6fd732;
  --lvl3-green: #98ff4f;
  --lvl1-blue: #347B98;
  --lvl2-blue: #092834;
  --fontH1: 4.209rem;
  --fontH2: 3.157rem;
  --fontH3: 2.369rem;
  --fontH4: 1.77rem;
  --fontTextBig: 1.33rem;
  --fontTextMedium: 1rem;
  --fontTextSmall: 0.75rem;
  --fontTextXSmall: 0.563rem;
}

header {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 10px 50px;
    background-color: var(--lvl1-green);
}
.header_link {
    margin: 0 15px;
    font-size: var(--fontH3);
    color: #186786;
    padding: 5px;
    border-radius: 5px;
    text-decoration: none;
    transition: border 500ms ease;
    position: relative;
}
.header_link::after {
    content: '';
    width: 100%;
    height: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: var(--lvl2-green);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 200ms ease;
}
.header_link:hover::after  {
    transform: scaleX(1);
}
.header_link.nuxt-link-exact-active::after{
    transform: scaleX(1);
}
</style>