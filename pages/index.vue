<template>
  <section class="page--home">
    <h1 class="home--tittle--main">Welcome to Best Dad Jokes inc.</h1>
    <p class="page--home--subtitle">A quick random Dad Joke</p>
    <button class="btn--primary" @click="fetchAJoke">Joke</button>
    <JokeContainer :joke="joke.joke" 
    :jokeId="joke.id"
    :jokeSlugId="joke.id" />
  </section>
</template>

<script>
import axios from 'axios'
import JokeContainer from '../components/JokeContainer.vue'

export default {
    components: { JokeContainer },
    head() {
        return {
            title: 'Welcome to Best DadJokes',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: "A place for the best dad jokes"
                }
            ]
        }
    },
    data() {
        return {
            joke: {}        
        }
    },
    methods: {
        fetchAJoke() {
            const config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            const res = axios.get('https://icanhazdadjoke.com/', config)
            .then(res => {
                this.joke = res.data
                console.log(this.joke)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
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


.page--home {
    text-align: center;
    padding: 50px 100px;
    background: linear-gradient(90deg, rgba(102,176,50,1) 0%, rgba(240,247,212,1) 50%, rgba(102,176,50,1) 100%);
    color: var(--lvl2-blue);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.home--tittle--main {
    text-align: center;
    font-size: var(--fontH1);
    padding-bottom: 150px;
}
.page--home--subtitle {
    font-size: var(--fontH3);
    color: var(--lvl2-blue);
    margin-bottom: 15px;
}
.btn--primary {
    color: var(--lvl2-blue);
    font-size: var(--fontH4);
    padding: 10px 15px;
    margin-bottom: 50px;
    background-color: var(--lvl3-green);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: box-shadow 100ms ease, filter 200ms ease;
}
.btn--primary:hover {
    box-shadow: inset 0 0 5px var(--lvl2-blue);
    filter: brightness(95%);
}


@media only screen and (max-width: 760px) {
    .page--home {
        padding: 25px 40px;
    }
    .home--tittle--main {
        font-size: var(--fontH2);
        padding-bottom: 75px;
    }
    .page--home--subtitle {
        font-size: var(--fontH4);
        margin-bottom: 10px;
    }
    .btn--primary {
        font-size: var(--fontTextBig);
        margin-bottom: 30px;
        border-radius: 7px;
    }
}
</style>