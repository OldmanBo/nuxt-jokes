<template>
  <section class="page--jokes">
      <h1>Oh, here's the list of all our DadJokes</h1>
      <h4>Switch to the:</h4>
      <button class="btn--toggle" @click="carousel = !carousel"><span v-if="carousel">List</span><span v-if="!carousel">Carousel</span></button> |
      <h4 v-if="carousel === false">Switch to the: </h4>
      <button class="btn--toggle" v-if="carousel === false" @click="changeAnimation"><span v-if="listAnimation === false">perspective animation</span><span v-if="listAnimation === true">scale animation</span></button>
      
      <template v-if="carousel === false">
          <p>Page: {{ curJokePage }}/{{ totalJokePages }}</p>
          <div class="jump_list-container">
              <label for="jump">Jump to the page: </label>
              <input class="input--jump" type="number" name="jump" min="1" :max="totalJokePages" v-model="jumpPage">
              <button @click="jumpToPage">JUMP</button>
          </div>
          <div class="joke--btn-container">  
              <button class="topBtn" @click="goPrevJokePage" :disabled="prevJokeBtnDisable === true">PREV</button>
              <button class="topBtn" @click="goNextJokePage" :disabled="nextJokeBtnDisable === true">NEXT</button>
          </div>
          <div class="joke-master_container" v-if="pageReady">
              <JokeContainer v-for="(aJoke, aJokeIndex) in jokes" 
              :key="aJoke.id" 
              :joke="aJoke.joke" 
              :jokeId="aJoke.id" 
              :jokeIndex="aJokeIndex" 
              :curJokePage="curJokePage" 
              :jokeSlugId="aJoke.id"/>
          </div>
          <div class="joke--btn-container">  
              <button class="botBtn" @click="goPrevJokePage" :disabled="prevJokeBtnDisable === true">PREV</button>
              <button class="botBtn" @click="goNextJokePage" :disabled="nextJokeBtnDisable === true">NEXT</button>
          </div>
      </template>
      <template v-if="carousel === true">
          <div class="carousel--btn-container">
              <h3>Slide Control</h3>
              <button @click="prevSlide">PREV</button>
              <button @click="nextSlide">NEXT</button>
          </div>
          <div class="joke--carousel">
              <JokeContainer v-for="(aJoke, aJokeIndex) in jokes"
              :class="{ 'left--slide': aJokeIndex === leftSlide, 'center--slide': aJokeIndex === centerSlide, 'right--slide': aJokeIndex === rightSlide }" 
              :key="aJoke.id" 
              :joke="aJoke.joke" 
              :jokeId="aJoke.id" 
              :jokeIndex="aJokeIndex" 
              :curJokePage="curJokePage" 
              :jokeSlugId="aJoke.id"/>
          </div>
          <div class="joke--btn-container">
              <h3>Change joke page</h3>  
              <button @click="goPrevJokePage" :disabled="prevJokeBtnDisable === true">PREV</button>
              <button @click="goNextJokePage" :disabled="nextJokeBtnDisable === true">NEXT</button>
              <p>Page: {{ curJokePage }}/{{ totalJokePages }}</p>
          </div>
            <div class="jump-container">
                <label for="jump">Jump to the page: </label>
                <input class="input--jump" type="number" name="jump" min="1" :max="totalJokePages" v-model="jumpPage">
                <button @click="jumpToPage">JUMP</button>
            </div>
      </template>
  </section>
</template>

<script>
import axios from 'axios'
import JokeContainer from '../../components/JokeContainer.vue'
import axiosConfig from '../../assets/helperFunctions.js'

export default {
    components: { JokeContainer },
    data() {
        return {
            jokes: [],
            jokeSlug: '',
            curJokePage: 1,
            prevJokePage: '',
            nextJokePage: '',
            totalJokePages: '',
            jumpPage: '',
            prevJokeBtnDisable: true,
            nextJokeBtnDisable: false,
            carousel: false,
            leftSlide: '',
            centerSlide: 0,
            rightSlide: 1,
            pageReady: false,
            domJokes: [],
            domJokesInnerContainers: [],
            topJokeObserver: null,
            listAnimation: true,
            listAnimationStyleCounter: 0,
            topOrBotBtn: 'topBtn'
        }
    },
    methods: {
        changeAnimation() {
            this.listAnimation = !this.listAnimation
            if(this.listAnimation === true) {
                this.domJokes.forEach((joke, jokeIndex) => {
                    if (jokeIndex >=4) {
                        joke.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                    } else {
                        joke.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(1)`
                    }
                })
            } else {
                this.domJokes.forEach((joke, jokeIndex) => {
                    if (jokeIndex >=3) {
                        joke.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(0.1)`
                    } else {
                        joke.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(1)`
                    }
                })
            }
        },
        async goPrevJokePage(e) {
            this.topOrBotBtn = e.target.classList[0]
            console.log(this.topOrBotBtn)
            try {
                const res = await axios.get('https://icanhazdadjoke.com/search?', axiosConfig('application/json', this.prevJokePage, 20, ''))
                this.jokes = res.data.results

                this.nextJokePage = res.data.next_page
                this.curJokePage = res.data.current_page
                this.prevJokePage = res.data.previous_page

                this.leftSlide = this.jokes.length - 1
                this.centerSlide = 0
                this.rightSlide = 1
                
                this.nextJokeBtnDisable = false
                if(this.curJokePage === this.prevJokePage) {
                    this.prevJokeBtnDisable = true
                }
                
                this.listAnimationStyleCounter = 0

            } catch (error) {
                console.log(error)
            }
        },
        async goNextJokePage(e) {
            this.topOrBotBtn = e.target.classList[0]
            console.log(this.topOrBotBtn)
            try {
                const res = await axios.get('https://icanhazdadjoke.com/search?', axiosConfig('application/json', this.nextJokePage, 20, ''))
                this.jokes = res.data.results

                this.nextJokePage = res.data.next_page
                this.curJokePage = res.data.current_page
                this.prevJokePage = res.data.previous_page

                this.leftSlide = this.jokes.length - 1
                this.centerSlide = 0
                this.rightSlide = 1

                this.prevJokeBtnDisable = false
                if(this.curJokePage === this.nextJokePage) {
                    this.nextJokeBtnDisable = true
                }

                this.listAnimationStyleCounter = 0

            } catch (error) {
                console.log(error)
            }
        },
        nextSlide() {
            if(this.leftSlide >= this.jokes.length - 1) {
                this.leftSlide = 0
            } else {
                this.leftSlide++
            }
            if(this.centerSlide >= this.jokes.length - 1) {
                this.centerSlide = 0
            } else {
                this.centerSlide++
            }
            if(this.rightSlide >= this.jokes.length - 1) {
                this.rightSlide = 0
            } else {
                this.rightSlide++
            }
        },
        prevSlide() {
            if(this.leftSlide <= 0) {
                this.leftSlide = this.jokes.length - 1
            } else {
                this.leftSlide--
            }
            if(this.centerSlide <= 0) {
                this.centerSlide = this.jokes.length - 1
            } else {
                this.centerSlide--
            }
            if(this.rightSlide <= 0) {
                this.rightSlide = this.jokes.length - 1
            } else {
                this.rightSlide--
            }
        },
        async jumpToPage() {
            try {
                if(this.jumpPage > this.totalJokePages) {
                    return
                } else {
                    const res = await axios.get('https://icanhazdadjoke.com/search?', axiosConfig('application/json', this.jumpPage, 20, ''))
                    this.jokes = res.data.results
                    this.nextJokePage = res.data.next_page
                    this.curJokePage = res.data.current_page
                    this.prevJokePage = res.data.previous_page
                    this.totalJokePages = res.data.total_pages
                    this.leftSlide = this.jokes.length - 1
                    this.listAnimationStyleCounter = 0
                    this.topOrBotBtn = 'topBtn'
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
    updated() {
        this.$nextTick(() => {
            this.domJokes = this.$el.querySelectorAll('.joke-master_container > .aJoke-container--link')
            console.log('updated dom')
            // this.domJokes[0].style.transform = `perspective(200px) rotateX(15deg) translateY(-15px) scaleX(0.9)`
                this.domJokes.forEach(jokee => {
                    this.topJokeObserver.observe(jokee)
            })
        })
    },
    mounted() {
        function testTop(BotomElPos, conditionIntRatio, testBotPos) {
            if(BotomElPos > testBotPos) {
                console.log('this ' + conditionIntRatio + ' ratio failed because the element botom position was' + BotomElPos)
            }
        }
        axios.get('https://icanhazdadjoke.com/search?', axiosConfig('application/json', 1, 20, ''))
        .then(res => {
            this.jokes = res.data.results
            this.nextJokePage = res.data.next_page
            this.curJokePage = res.data.current_page
            this.prevJokePage = res.data.previous_page
            this.totalJokePages = res.data.total_pages
            this.leftSlide = this.jokes.length - 1
            this.pageReady = true
            
        })
        .then(() => {
            this.domJokes = this.$el.querySelectorAll('.joke-master_container > .aJoke-container--link')

            const obstresholds = [];
            for(let i = 1; i <= 50; i++) {
                obstresholds.push(i / 50)
            }

            this.topJokeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(this.listAnimation === true) {
                        if(!entry.isIntersecting) {
                            if(this.topOrBotBtn === 'topBtn') {
                                if(this.listAnimationStyleCounter <= 16) {
                                    if (entry.target.offsetHeight > 280) {
                                        entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(50px) scaleX(0.65)`
                                    } else {
                                        entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                                        console.log('style changed')
                                        this.listAnimationStyleCounter++
                                    }
                                }
                            } else if(this.topOrBotBtn === 'botBtn') {
                                    if(this.listAnimationStyleCounter <= 19) {
                                        if (entry.target.offsetHeight > 280) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-50px) scaleX(0.65)`
                                        } else {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-35px) scaleX(0.8)`
                                            console.log('style changed')
                                            this.listAnimationStyleCounter++
                                        }
                                }
                            }
                        }
                        if(entry.isIntersecting) {
                            if (entry.target.offsetHeight < 230) {
                                if(entry.intersectionRatio === 1) {
                                entry.target.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(1)`
                                } else {
                                    if(entry.intersectionRect.bottom < 250) {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-35px) scaleX(0.8)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(15deg) translateY(-15px) scaleX(0.9)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(30deg) translateY(-25px) scaleX(0.85)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-35px) scaleX(0.8)`
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                // if(entry.target.nextElementSibling) {
                                                //     entry.target.nextElementSibling.style.transform = 'perspective(200px) rotateX(5deg) translateY(-5px) scaleX(0.97)'
                                                // }
                                            }

                                        }
                                    } else {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-15deg) translateY(15px) scaleX(0.9)`
                                                if(entry.target.previousElementSibling) {
                                                    entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                }
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-30deg) translateY(25px) scaleX(0.85)`
                                                entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                                                // if(entry.target.previousElementSibling) {
                                                //     entry.target.previousElementSibling.style.transform = 'perspective(200px) rotateX(-5deg) translateY(5px) scaleX(0.97)'
                                                // }
                                            }
                                        }
                                    }
                                }
                            } else if (entry.target.offsetHeight > 230 && entry.target.offsetHeight <= 280) {
                                if(entry.intersectionRatio === 1) {
                                entry.target.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(1)`
                                } else {
                                    if(entry.intersectionRect.bottom < 320) {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-35px) scaleX(0.8)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(15deg) translateY(-15px) scaleX(0.9)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(30deg) translateY(-29px) scaleX(0.80)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-39px) scaleX(0.75)`
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                                // if(entry.target.nextElementSibling) {
                                                //     entry.target.nextElementSibling.style.transform = 'perspective(200px) rotateX(5deg) translateY(-5px) scaleX(0.97)'
                                                // }
                                            }

                                        }
                                    } else {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-15deg) translateY(15px) scaleX(0.9)`
                                                if(entry.target.previousElementSibling) {
                                                    entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                }
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-30deg) translateY(25px) scaleX(0.80)`
                                                entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(35px) scaleX(0.8)`
                                                // if(entry.target.previousElementSibling) {
                                                //     entry.target.previousElementSibling.style.transform = 'perspective(200px) rotateX(-5deg) translateY(5px) scaleX(0.97)'
                                                // }
                                            }
                                        }
                                    }
                                }
                            } else if(entry.target.offsetHeight > 280){
                                if(entry.intersectionRatio === 1) {
                                    entry.target.childNodes[0].style.transform = `perspective(0px) rotateX(0deg) translateY(0) scaleX(1)`
                                } else {
                                    if(entry.intersectionRect.bottom < 370) {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-50px) scaleX(0.65)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(15deg) translateY(-28px) scaleX(0.84)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(30deg) translateY(-45px) scaleX(0.70)`
                                                entry.target.nextElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(40deg) translateY(-50px) scaleX(0.65)`
                                                testTop(entry.intersectionRect.bottom, '66', '250')
                                                console.log(entry.target.offsetHeight)
                                                console.log(entry.intersectionRect.bottom + ' bot pos')
                                                // if(entry.target.nextElementSibling) {
                                                //     entry.target.nextElementSibling.style.transform = 'perspective(200px) rotateX(5deg) translateY(-5px) scaleX(0.97)'
                                                // }
                                            }

                                        }
                                    } else {
                                        if(!entry.isIntersecting) {
                                            entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(50px) scaleX(0.65)`
                                        } else {
                                            if(entry.intersectionRatio >= 0.6612412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-15deg) translateY(28px) scaleX(0.84)`
                                                if(entry.target.previousElementSibling) {
                                                    entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                                }
                                            } else if(entry.intersectionRatio >= 0.3312412412412) {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-30deg) translateY(45px) scaleX(0.70)`
                                                entry.target.previousElementSibling.childNodes[0].style.transform = 'perspective(0px) rotateX(0deg) translateY(0) scaleX(1)'
                                            } else {
                                                entry.target.childNodes[0].style.transform = `perspective(200px) rotateX(-40deg) translateY(50px) scaleX(0.65)`
                                                // if(entry.target.previousElementSibling) {
                                                //     entry.target.previousElementSibling.style.transform = 'perspective(200px) rotateX(-5deg) translateY(5px) scaleX(0.97)'
                                                // }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if(this.listAnimation === false) {
                        if(!entry.isIntersecting) {
                        entry.target.childNodes[0].style.transform = `scaleX(0.1)`
                        }
                        if(entry.isIntersecting) {
                            if(entry.intersectionRatio < 0.1) {
                                entry.target.childNodes[0].style.transform = `scaleX(0.1)`
                        } else {
                           entry.target.childNodes[0].style.transform = `scaleX(${entry.intersectionRatio})`
                            }
                        }
                    }
                })
            }, {root: this.window, rootMargin: '-50px 0px -50px 0px', threshold: obstresholds})

            this.domJokes.forEach(jokee => {
                this.topJokeObserver.observe(jokee)
            })
            this.domJokes[0].childNodes[0].style.transform = `perspective(200px) rotateX(15deg) translateY(-15px) scaleX(0.9)`
        })
        .catch(err => {
            console.log('error in created(), while getting to the api' + err)
        })
    },
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

.page--jokes {
    background: radial-gradient(circle, rgba(102,176,50,1) 0%, rgba(240,247,212,1) 50%, rgba(102,176,50,1) 100%);
    padding: 70px 10%;
    min-height: 100vh;
}
.page--jokes h4, .btn--toggle {
    text-align: left;
    display: inline-block;
}
.btn--toggle {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.822);
    /* border-radius: 20%; */
    background: transparent;
    padding: 2px;
    font-weight: 700;
    cursor: pointer;
}


.joke-master_container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.joke-master_container .aJoke-container--link{
    transition: transform 200ms ease-in, opacity 200ms ease;
}
.joke-master_container .aJoke-container{
    transition: transform 200ms ease-in, opacity 200ms ease;
}
.joke-master_container .aJoke-container--link{
    transition: transform 200ms ease-in, opacity 200ms ease;
}

.page--jokes .aJoke-container {
    padding: 30px 30px;
    border: 1px solid black;

}
.page--jokes .aJoke-container--link + .aJoke-container--link {
    margin-top: 10px;
}

.page--jokes h1 {
    text-align: center;
    font-size: var(--fontH2);
    padding: 50px;
}

.joke--btn-container {
    text-align: center;
}
.joke--btn-container button {
    width: 50px;
    height: 35px;
    border: none;
    border-radius: 20px;
    background-color: var(--lvl3-green);
    padding: 5px;
    margin-bottom: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: box-shadow 100ms ease, filter 200ms ease;
}
.joke--btn-container button:hover {
    box-shadow: inset 0 0 5px var(--lvl2-blue);
    filter: brightness(95%);
}
.joke--btn-container button:disabled {
    filter: brightness(50%);
    cursor:not-allowed;
}
.joke--btn-container button:disabled:hover {
    cursor:not-allowed;
    box-shadow: none;
}

.page--jokes .joke--btn-container:last-child {
    margin-top: 20px;
}
.jump_list-container {
    text-align: left;
    margin-bottom: 5px;
}
.jump_list-container button {
    border: none;
    background-color: var(--lvl3-green);
    margin-top: 10px;
    font-weight: 600;
    padding: 4px;
    cursor: pointer;
}

/* style for the carousel */
.joke--carousel {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    max-width: 900px;
    padding: 0 200px;
    margin: auto;
}
.page--jokes .joke--carousel .aJoke-container--link + .aJoke-container--link {
    margin: 0;
}
.page--jokes .joke--carousel .aJoke-container {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.212);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.page--jokes .joke--carousel .aJoke-container--link {
    max-width: 600px;
    min-width: 350px;
    border-radius: 20px;
    transform: scale(0);
    opacity: 0;
    display: block;
    height: 450px;
    z-index: -5;
    position: absolute;
    margin: auto;
    top: 0;
    overflow: hidden;
    transition: transform 200ms ease, opacity 200ms ease;
}
.page--jokes .joke--carousel .aJoke-container--link.left--slide {
    z-index: 1;
    transform: scale(0.8) translateX(-50%);
    opacity: 0.6;
    position: absolute;
    pointer-events: none;
    transition: transform 200ms ease, opacity 0ms ease;
}
.page--jokes .joke--carousel .aJoke-container--link.center--slide {
    z-index: 2;
    position: relative;
    transform: scale(1);
    opacity: 1;
    margin: auto;
    left: unset;
    transition: transform 200ms ease, opacity 100ms ease;
    min-height: 450px;
}
.page--jokes .joke--carousel .aJoke-container--link.center--slide:hover {
    animation-name: slideHover;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
}
@keyframes slideHover {
    from {
        box-shadow: 0 0 5px rgba(111, 215, 51, 0.745);
        filter: brightness(100%);
    }
    to {
        box-shadow: 0 0 50px 5px rgba(111, 215, 51, 0.897);
        filter: brightness(120%);
    }
}
.page--jokes .joke--carousel .aJoke-container--link.right--slide {
    z-index: 1;
    transform: scale(0.8) translateX(50%);
    opacity: 0.6;
    position: absolute;
    pointer-events: none;
    transition: transform 200ms ease, opacity 0ms ease;
}
.carousel--btn-container {
    text-align: center;
    padding: 20px;
}
.carousel--btn-container h3 {
    margin-bottom: 5px;
}
.carousel--btn-container button {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: 2px solid transparent;
    background-color: var(--lvl1-green);
    font-weight: 700;
    cursor: pointer;
    transition: border 100ms ease-in;
}
.carousel--btn-container button:hover {
    border: 2px solid var(--lvl2-green);
}
.joke--btn-container h3 {
    margin-bottom: 10px;
}
.input--jump {
    width: 35px;
}
.jump-container {
    text-align: center;
    margin-top: 10px;
}
.jump-container button {
    display: block;
    border: none;
    background-color: var(--lvl3-green);
    margin: 10px auto 0 auto;
    font-weight: 600;
    padding: 7px;
    cursor: pointer;
}

@media only screen and (max-width: 768px) {
    .page--jokes {
        padding: 40px 10%;
    }
    .page--jokes .aJoke-container {
        padding: 20px 20px;
    }
    .page--jokes .aJoke-container--link + .aJoke-container--link {
        margin-top: 7px;
    }
    .page--jokes h1 {
        font-size: var(--fontH4);
        padding: 30px;
    }

    .joke--btn-container button {
        width: 35px;
        height: 25px;
        font-size: var(--fontTextXSmall);
        border-radius: 15px;
        padding: 3px;
        margin-bottom: 10px;
    }
    .page--jokes .joke--btn-container:last-child {
        margin-top: 10px;
    }
    .joke--carousel {
        padding: 0 150px;
    }
    .page--jokes .joke--carousel .aJoke-container--link {
        min-width: 250px;
        max-height: 380px;
        border-radius: 15px;
    }
    .page--jokes .joke--carousel .aJoke-container--link.left--slide  {
        transform: scale(0.8) translateX(-30%);
    }
    .page--jokes .joke--carousel .aJoke-container--link.right--slide {
        transform: scale(0.8) translateX(30%);
    }
    .page--jokes .joke--carousel .aJoke-container--link.center--slide {
        min-height: 380px;
    }
    .carousel--btn-container {
        padding: 15px;
    }
    .carousel--btn-container h3 {
        font-size: var(--fontTextMedium);
    }
    .carousel--btn-container button {
        width: 32px;
        height: 32px;
        font-size: var(--fontTextXSmall);
    }
}
</style>