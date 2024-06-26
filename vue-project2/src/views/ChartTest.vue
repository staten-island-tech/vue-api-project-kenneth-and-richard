<template>
    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="transitionActive">
        <div class="howToPlayMenu">
            <h1>How to play:</h1>
            <p class="description">The line chart displays the correct currency's historical exchange rate with USD.</p>
            <p class="description">The pie chart represents the correct currency's value compared to the other options. <span style="color: var(--gold)">The other options will be rounded up or down if they are 10x less or 10x more than the correct currency</span>, respectively.</p>
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
            <button @click="transitionActive = false" id="tutorialButton">
              <p id="tutorialButtonText">Continue</p>
              <img src="/play2.svg" id="tutorialButtonImg">
            </button>
        </div>
    </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="outcomeCorrect">
        <div class="howToPlayMenu">
            <div class="scoreTotal">
              <p>Current score: {{ scoreCounter.currentScore.value }}</p>
              <p>High score: {{ scoreCounter.highScore.value }}</p>
            </div>
            <div id="progressBar">
                <div class="fillerBar"
                :style="{ width: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value))) * 100) + '%' }"
                :class="{ full: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value)))) == 1 }"></div>
            </div>
            <h3 v-if="(Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value)))) == 1">You're on a roll! Keep going to increase your high score!</h3>
            <h3 v-else>Almost there! Win {{ scoreCounter.highScore.value - scoreCounter.currentScore.value }} more times to reach your high score!</h3>

            <div class="answerReveal">
              <div class="youPicked">
                <h3>You picked:</h3>
                <button class="choiceButton active">
                  <h3>{{ answerChoice.code }}</h3>
                  <p>{{ answerChoice.name }}</p>
                </button>
              </div>
            </div>

            <button @click="nextQuestion" class="nextButton">Next</button>
        </div>
    </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="outcomeWrong">
        <div class="howToPlayMenu">
            
          <div class="scoreTotal">
            <p>Current score: {{ scoreCounter.currentScore.value }}</p>
            <p>High score: {{ scoreCounter.highScore.value }}</p>
          </div>
          <div id="progressBar">
              <div class="fillerBar"
              :style="{ width: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value))) * 100) + '%' }"
              :class="{ full: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value)))) == 1 }"></div>
          </div>
          <h3>Unlucky. Better luck next time!</h3>

          <div class="answerReveal">
            <div class="youPicked">
              <h3>You picked:</h3>
              <button class="choiceButton">
                <h3>{{ answerChoice.code }}</h3>
                <p>{{ answerChoice.name }}</p>
              </button>
            </div>
            <div class="correctPick">
              <h3>The correct answer was:</h3>
              <button class="choiceButton active">
                <h3>{{ correctChoice.code }}</h3>
                <p>{{ correctChoice.name }}</p>
              </button>
            </div>
          </div>

            <RouterLink to="/" @click="wrong" class="nextButton">Retry</RouterLink>
        </div>
    </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="error">
        <div class="howToPlayMenu">
          <h1>Sorry, there was an error!</h1>
          <h3>Your progress will be saved</h3>
          <button @click="errorNext" class="nextButton">Try again</button>
        </div>
      </div>
    </Transition>

    <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="leave">
        <div class="howToPlayMenu">
          <h1>Return to main menu?</h1>
          <h3>Your progress will save!</h3>
          <div class="leaveButtonArray">
            <RouterLink to="/" class="nextButton" style="background-color: var(--deepGreen);">Return</RouterLink>
            <button @click="leave = false" class="nextButton" style="background-color: #ff5050;">Cancel</button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="scoreTotal">
      <p>Current score: {{ scoreCounter.currentScore.value }}</p>
      <p v-if="scoreCounter.currentScore.value != 0 || scoreCounter.highScore.value != 1">High score: {{ scoreCounter.highScore.value }}</p>
    </div>
    <div id="progressBar" style="margin-bottom: 3em">
      <div class="fillerBar"
      :style="{ width: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value))) * 100) + '%' }"
      :class="{ full: (Math.min(1, Math.max(0, (scoreCounter.currentScore.value / scoreCounter.highScore.value)))) == 1 }"></div>
    </div>

    <div class="charts">
      <LineChart :Choices="choices"
      :CorrectChoice="correctChoice"
      v-if="loaded"
      @response="error = true"/>

      <DonutChart :Choices="choices"
      :CorrectChoice="correctChoice"
      v-if="loaded"
      @response="error = true"/>
    </div>

    <div class="buttonArray" v-if="loaded">
      <button v-for="choice in choices"
      @click="answer(choice)"
      :class="{ active: answerChoice == choice }"
      class="choiceButton">
        <h3>{{ choice.code }}</h3>
        <p>{{ choice.name }}</p>
      </button>
    </div>

    <div class="submitButtonArray">
      <button @click="leave = true" class="question">
        <img src="/leftArrow.svg" alt="Click for help">
      </button>

      <button @click="transitionActive = true" class="question" style="background-color: #FFEA50;">
        <img src="/questionMark.svg" alt="Click for help">
      </button>

      <button @click="submit" class="submit" :class="{ grayscaleImg: answerChoice == null }">
        <img src="/blackCheck.svg" alt="Click to submit your answer" id="submitImg">
        <h3>Submit</h3>
      </button>
    </div>


</template>

<script setup>

import LineChart from '@/components/LineChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import { ref, onMounted } from 'vue';
import { settings } from '@/stores/settings';
import { scoreCounter } from '@/stores/scores';

const loaded = ref(false);
const choices = ref();
const correctChoice = ref();
const error = ref(false);
const transitionActive = ref(false);
const answerChoice = ref(null);
const outcomeCorrect = ref(false);
const outcomeWrong = ref(false);
const leave = ref(false);

function wrong () {
  outcomeWrong.value = false;
  answerChoice.value = null;
}

function answer (choice) {
  answerChoice.value = choice;
}

function errorNext () {
  loaded.value = false;

  try {
    getData();
    error.value = false;
  } catch (error) {
    console.warn(error);
    error.value = true;
  }
}

function nextQuestion () {
  outcomeCorrect.value = false;
  answerChoice.value = null;
}

function submit () {
  if (answerChoice.value == null) {
    return;
  }
  // -------------
  if (answerChoice.value == correctChoice.value) {

    outcomeCorrect.value = true;
    loaded.value = false;

    try {
      getData();
    } catch (error) {
      console.warn(error);
      error.value = true;
    }

    setTimeout(() => {
      scoreCounter.currentScore.value++;
      if (scoreCounter.highScore.value < scoreCounter.currentScore.value) {
        scoreCounter.highScore.value = scoreCounter.currentScore.value;
      }
    }, 750);
    // ------------
  } else {

    outcomeWrong.value = true;
    loaded.value = false;
    
    setTimeout(() => {
      if (scoreCounter.highScore.value < scoreCounter.currentScore.value) {
        scoreCounter.highScore.value = scoreCounter.currentScore.value;
      }
      scoreCounter.scoreHistory.value.length = 0;
      scoreCounter.scoreHistory.value.push([scoreCounter.currentScore.value, new Date().toLocaleDateString(), new Date().toJSON().slice(11, 19)]);
      scoreCounter.currentScore.value = 0;
    }, 750);

  }
}

onMounted(() => {
    if (settings.help.value == true) {
      transitionActive.value = true;
    }
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

    setTimeout(() => {
      if (loaded.value != true) {
        error.value = true;
      }
    }, 5000);

    let data;
    let historicalData;
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (String(day).length == 1) {
        day = "0" + day;
    }
    if (String(month).length == 1) {
        month = "0" + month;
    }
    let year = date.getFullYear();
    
    try {
        const response = await fetch(`https://api.fxratesapi.com/currencies`);
        const history = await fetch(`https://api.fxratesapi.com/historical?api_key=fxr_demo_asdiksd21&date=${year - 15}-${month}-${day}`);
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
    let rollNumber = 0;

    while (rollNumber < settings.choices.value) {
        let randomNumber = getRandomIntInclusive(0, allAvailableCurrencies.length - 1);
        const currencyName = allAvailableCurrencies[randomNumber][0];
        // console.log(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName))
        if (!pickedCurrencies.includes(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName)[1])) {
          rollNumber++;
          pickedCurrencies.push(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName)[1]);
        }
    }

    choices.value = pickedCurrencies;
    correctChoice.value = pickedCurrencies[getRandomIntInclusive(0, pickedCurrencies.length - 1)];
    console.clear();
    console.info("Reveal answer", [correctChoice.value]);

    loaded.value = true;
}

</script>

<style scoped>

.leaveButtonArray {
  display: flex;
  gap: 10em;
}

.charts {
  height: 25em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 90%;
}

.answerReveal {
  display: flex;
  width: 90%;
  justify-content: space-evenly;
}

.scoreTotal {
  font-size: var(--h3);
}
.scoreTotal p {
  margin-bottom: 0;
  margin-top: 0;
}

.nextButton {
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: var(--h2);
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 0.5em;
  background-color: var(--aqua);
  transition: all 0.5s;
  text-decoration: none;
}
.nextButton:hover {
  transform: scale(1.1);
}

#progressBar {
  width: 70%;
  height: 3em;
  background-color: var(--lightContent);
  border-radius: 3em;
  margin-top: 1em;
  transition: all 0.5s;
}
#progressBar:hover {
  transform: scaleX(1.05);
}

.fillerBar {
  height: 100%;
  background: linear-gradient(to right, #ff9100, #f2a83a, #ff9100);
  border-radius: 3em;
  transition: all 0.4s ease-in-out;
}

.full {
  background: linear-gradient(to right, #7700ff, #b23af2, #7700ff);
}

.submitButtonArray {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 3vh;
  gap: 3em;
}

.submit {
  display: flex;
  align-items: center;
  gap: 1em;
  padding-left: 2.5em;
  padding-right: 3em;
  border-radius: 3em;
  background-color: var(--deepGreen);
  transition: all 0.5s;
}
#submitImg {
  width: 6em;
  height: 6em;
  transition: all 0.5s;
}
.submit:hover {
  transform: scale(1.1);
}
.submit:hover #submitImg {
  transform: rotate(720deg);
}

.question {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6em;
  height: 6em;
  border-radius: 3em;
  background-color: #ff5050;
  transition: all 0.5s;
  border: 0;
}
.question img {
  width: 6em;
  height: 6em;
}
.question:hover {
  transform: scale(1.1);
}

.grayscaleImg {
  filter: grayscale(1) brightness(0.5);
}

.returnButton {
  color: white;
}

.buttonArray {
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  max-width: 100em;
  justify-content: space-evenly;
  align-items: center;
  gap: 2em;
  background-color: var(--lightContent);
  padding: 2em;
  border-radius: 3em;
  margin-top: 5svh;
}

.choiceButton {
  width: 15.5em;
  background-color: var(--invisible);
  border: 0;
  color: white;
  transition: all 0.5s;
  font-size: var(--h4);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 8.65em;
}
.choiceButton h3 {
  background: linear-gradient(to right, #ff0000, #ffbb00, #bbff00, #00ff4c, #00ffff, #00c3ff, #ff00ff);
  width: fit-content;
  background-clip: text;
  color: transparent;
  margin-top: 0.75em;
  margin-bottom: 0;
}
.choiceButton p {
  margin-top: 0;
  margin-bottom: 2em;
  max-width: 70%;
}
.choiceButton:hover {
  border-radius: 1.5em;
  transform: scale(1.05);
}

.active {
  border-radius: 1.5em;
  transform: scale(1.05);
  background-color: var(--deepGreen);
  color: black;
}
.active h3 {
  color: black;
}

#tutorialButtonImg {
  width: 2.5em;
  height: 2.5em;
  transition: all 0.75s;
}

#tutorialButton {
  margin-top: 1em;
  margin-bottom: 1em;
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
  min-width: 75em;
  max-width: 125em;
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 3vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-height: 80%;
  min-height: 30%;
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
  margin-top: 0.5em;
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