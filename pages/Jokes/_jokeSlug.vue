<template>
  <div class="page--joke_slug" v-if="joke !== {}">
      <JokeContainer :joke="joke.joke" :jokeId="joke.id" :jokeSlugId="joke.id"/>
  </div>
</template>

<script>
import axios from "axios"
import JokeContainer from '../../components/JokeContainer.vue'

export default {
  beforeRouteEnter: (to, from, next) => {
    axios.get(`https://icanhazdadjoke.com/j/${to.params.jokeSlug}`, {headers: {'Accept': 'application/json'}})
    .then(res => {
      if(res.data.status === 404) {
        console.log(to.params.jokeSlug + ' ' + 'ERRORs')
        next({name: 'NotFound'})
      } else {
        console.log(res.data + ' ' + to.params.jokeSlug + ' ' + 'success')
        next()
      }
    })
    .catch(err => {
      console.log('ERROR ' + err + ' ' + res.data + ' ' + to.params.jokeSlug)
    })
  },
  components: {JokeContainer},
  data() {
    return {
      joke: {}
    }
  },
  created() {
      axios.get(`https://icanhazdadjoke.com/j/${this.$route.params.jokeSlug}`, {headers: {'Accept': 'application/json'}})
      .then(res => {
        this.joke = res.data
      })
      .catch(err => {
        console.log(err)
      })
    }
}
</script>

<style>

.page--joke_slug {
  background: linear-gradient(90deg, rgba(102,176,50,1) 0%, rgba(240,247,212,1) 50%, rgba(102,176,50,1) 100%);
  min-height: 100vh;
  padding: 0 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.page--joke_slug .joke {
  font-size: var(--fontH3);
}

@media only screen and (max-width: 768px) {
  .page--joke_slug .joke {
    font-size: var(--fontTextBig);
  }
}
</style>