<template>
    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="transitionActive">
        <div class="howToPlayMenu">
            <h1>How to play:</h1>
            <p class="description">You will be given a line chart of a currency's historical exchange rate from USD, and a pie chart of a currency's value compared to the other options.</p>
            <div class="howToPlayDescription">
              <div class="summary">
                <img src="/redUp.svg" class="howToPlayImg">
                <p class="description" style="color: var(--pastelRed)">Higher number = less valuable</p>
              </div>
              <div class="summary">
                <p class="description" style="color: var(--pastelGreen)">Lower number = more valuable</p>
                <img src="/greenDown.svg" class="howToPlayImg">
              </div>
            </div>
            <h3 class="description" style="margin-top: 3em; color: var(--gold);">Identify the correct currency to move on!</h3>
            <button @click="transitionActive = false" id="tutorialButton">
              <p id="tutorialButtonText">Start!</p>
              <img src="/play2.svg" id="tutorialButtonImg">
            </button>
        </div>
    </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="outcomeCorrect">
        <div class="howToPlayMenu">
            <h1>correct ggs</h1>
            <button @click="outcomeCorrect = false">Next</button>
        </div>
    </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="outcomeWrong">
        <div class="howToPlayMenu">
            <h1>wrong smh</h1>
            <RouterLink to="/" @click="wrong" class="returnButton">Done</RouterLink>
        </div>
    </div>
    </Transition>

    <h1 v-if="error">Error</h1>

    <div class="charts">
        <LineChart :Choices="choices"
        :CorrectChoice="correctChoice"
        v-if="loaded"
        @response="error = true"/>
    </div>
    

    <div class="buttonArray">
        <button v-for="choice in choices"
        @click="answer(choice)"
        :class="{ active: answerChoice == choice }"
        class="choiceButton">
          {{ choice.code }} {{ choice.name }}
        </button>
    </div>

    <button @click="submit">Submit</button>

</template>

<script setup>

import LineChart from '@/components/LineChart.vue';
import { ref, onMounted } from 'vue';

const loaded = ref(false);
const choices = ref();
const correctChoice = ref();
const error = ref(false);
const transitionActive = ref(false);
const answerChoice = ref();
const outcomeCorrect = ref(false);
const outcomeWrong = ref(false);

function wrong () {
  outcomeWrong.value = false;
}

function answer (choice) {
  answerChoice.value = choice;
}

function submit () {
  if (answerChoice.value == correctChoice.value) {
    outcomeCorrect.value = true;
    loaded.value = false;
    try {
      getData();
    } catch (error) {
      console.warn(error);
      error.value = true;
    }
    return;
  }

  outcomeWrong.value = true;
  loaded.value = false;
}

onMounted(() => {
    transitionActive.value = true;
    loaded.value = false;
    try {
        getData();
    } catch (error) {
        console.warn(error);
        error.value = true;
    }
});

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

async function getData () {
    let data;
    let historicalData;
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (String(month).length == 1) {
        month = "0" + month;
    }
    let year = date.getFullYear();
    try {
        const response = await fetch(`https://api.fxratesapi.com/currencies`);
        const history = await fetch(`https://api.fxratesapi.com/historical?api_key=fxr_demo_asdiksd21&date=${year - 5}-${month}-${day}`);
        data = await response.json();
        historicalData = await history.json();
    } catch (error) {
        console.warn(error);
        error.value = true;
    }

    const allCurrencies = Object.entries(data);
    const allAvailableCurrencies = Object.entries(historicalData.rates);
    // console.log(allCurrencies)
    // console.log(allAvailableCurrencies)
    const pickedCurrencies = [];

    for (let i = 0; i < 3; i++) {
        let randomNumber = getRandomIntInclusive(0, allAvailableCurrencies.length - 1);
        const currencyName = allAvailableCurrencies[randomNumber][0];
        // console.log(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName))
        pickedCurrencies.push(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName)[1]);
    }

    choices.value = pickedCurrencies;
    correctChoice.value = pickedCurrencies[getRandomIntInclusive(0, pickedCurrencies.length - 1)];

    loaded.value = true;
}

</script>

<style scoped>

.returnButton {
  color: white;
}

.choiceButton {
  background-color: var(--normalText);
}

.active {
  background-color: var(--deepGreen);
}

#tutorialButtonImg {
  width: 2.5em;
  height: 2.5em;
  transition: all 0.75s;
}

#tutorialButton {
  margin-top: auto;
  margin-bottom: 3vh;
  height: 2em;
  width: 2em;
  font-size: var(--h2);
  border-radius: 1em;
  background-color: var(--deepGreen);
  transition: all 0.75s;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 0;
}
#tutorialButton:hover {
  transform: scale(1.1);
  width: 16em;
}
#tutorialButton:hover #tutorialButtonImg {
  width: 3.1em;
  height: 3.1em;
  transform: rotate(720deg);
  translate: 7em;
}

#tutorialButtonText {
  position: absolute;
  z-index: -1;
}

.howToPlayDescription {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin-top: 5svh;
}
.summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin-bottom: 1.25em;
}

.howToPlayImg {
  width: 5em;
  height: 5em;
}

.howToPlayBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, var(--gradientGray1), var(--gradientGray2), var(--gradientGray3), var(--gradientGray4));
  overflow: hidden;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.howToPlayMenu {
  width: 70vw;
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 3vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 80%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}
.howToPlayMenu .description {
  font-size: var(--h3);
  max-width: 70%;
  margin-bottom: 0;
  margin-top: 0;
}

.howToPlay-enter-active, .howToPlay-leave-active {
  transition: all 0.5s ease-in-out;
}

.howToPlay-leave-active {
  transition-delay: 0.15s;
}

.howToPlay-enter-from,
.howToPlay-leave-to {
  opacity: 0;
}

.howToPlay-enter-active .howToPlayMenu,
.howToPlay-leave-active .howToPlayMenu { 
  transition: all 0.25s ease-in-out;
}

.howToPlay-enter-active .howToPlayMenu {
  transition-delay: 0.15s;
}

.howToPlay-enter-from .howToPlayMenu,
.howToPlay-leave-to .howToPlayMenu {
  transform: translateY(30px);
  opacity: 0.001;
}

</style>