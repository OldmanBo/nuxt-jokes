<template>
  <nuxt-link class="aJoke-container--link" :to="{ name: 'Jokes-jokeSlug', params: { jokeSlug: jokeSlugId } }">
      <div class="aJoke-container" v-if="joke">
            <div class="joke_overlay"></div>
            <p class="joke_id">Joke id: <em>{{ jokeId }}</em></p>
            <p class="joke"><span v-if="jokeIndex + 1">{{ ((curJokePage - 1) * 20) + (jokeIndex + 1) }}.</span>  {{ joke }}</p>
      </div>
  </nuxt-link>
</template>

<script>
export default {
    props: ['joke', 'jokeId', 'jokeIndex', 'curJokePage', 'jokeSlugId'],
    data() {
        return {

        }
    }
}
</script>

<style>
:root {
  --lvl1-green: #F0F7D4;
  --lvl2-green: #6fd732;
  --lvl2-green50: rgba(111, 215, 50, 0.9);
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

.joke_overlay {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    position: absolute;
    background-color: #ffffffa6;
    top: 0;
    left: 0;
    filter: blur(50px);
    z-index: 2;
}

.joke_id {
   
    margin-bottom: 0;
    font-size: var(--fontTextMedium);
    color: black;
}
.joke {
    z-index: 5;
    margin: 0;
    position: relative;
    font-size: var(--fontH4);
    color: var(--lvl2-blue);
}
.aJoke-container {
    background: var(--lvl2-green50);
    padding: 15px 30px;
    max-width: 580px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid var(--lvl2-blue);
}

.aJoke-container::after, .aJoke-container::before {
    position: absolute;
    content: '';
    width: 35px;
    height: 35px;
    border-radius: 100%;
    border: none;
    background-color: var(--lvl2-blue);
    z-index: 1;
}
.aJoke-container::after {
    top: -12px;
    right: -12px;
}
.aJoke-container::before {
    top: -12px;
    left: -12px;
}


@media only screen and (max-width: 768px) {
    .joke_id {
        font-size: var(--fontTextSmall);
    }
    .joke {
        font-size: var(--fontTextBig);
    }
    .aJoke-container {
        padding: 12px 23px;
        border-radius: 15px;
        max-width: 447px;
    }
}
</style>