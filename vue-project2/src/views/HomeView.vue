<template>
  <div class="title">
    <img src="/money.svg" id="titleImg">
    <h1>Guess the <span style="color: var(--deepGreen)">$$$</span></h1>
  </div>

  <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="showSettings">
        <div class="howToPlayMenu">
            <h1>Settings</h1>
            <div class="settingsHolder">

              <div class="setting">
                <h3>Answer Choices</h3>
                <div class="incrementButtonArray">
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.choices.value == settings.minChoices }"
                  @click="decrement('choices')">
                    <img src="/minus.svg" id="incrementButtonImg">
                  </button>
                  <h3 id="incrementText">{{ settings.choices.value }}</h3>
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.choices.value == settings.maxChoices }"
                  @click="increment('choices')">
                    <img src="/plus.svg" id="incrementButtonImg">
                  </button>
                </div>
              </div>

              <div class="setting">
                <h3>Exchange Rate History (years)</h3>
                <div class="incrementButtonArray">
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.history.value == settings.minHistory }"
                  @click="decrement('history')">
                    <img src="/minus.svg" id="incrementButtonImg">
                  </button>
                  <h3 id="incrementText">{{ settings.history.value }}</h3>
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.history.value == settings.maxHistory }"
                  @click="increment('history')">
                    <img src="/plus.svg" id="incrementButtonImg">
                  </button>
                </div>
              </div>

              <div class="setting">
                <h3>Tutorial Guide</h3>
                <div class="incrementButtonArray">
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.help.value == true }"
                  @click="settings.help.value = !settings.help.value">
                    <img src="/redX.svg" id="incrementButtonImg">
                  </button>
                  <h3 id="incrementText">{{ settings.help.value }}</h3>
                  <button class="incrementButton"
                  :class="{ grayscaleImg: settings.help.value == false }"
                  @click="settings.help.value = !settings.help.value">
                    <img src="/check.svg" id="incrementButtonImg">
                  </button>
                </div>
              </div>

            </div>
            <button @click="showSettings = false" class="saveButton">Save</button>
        </div>
    </div>
  </Transition>

  <Transition name="howToPlay">
      <div class="howToPlayBackground" v-if="showScores">
        <div class="howToPlayMenu">
            <h1>Score history</h1>
            <h3>High score: {{ scoreCounter.highScore.value }}</h3>
            <div id="progressBar">
              <div class="fillerBar full"
              :style="{ width: 100 + '%' }"></div>
            </div>
            <div class="scoreHolder">
              <h2>Previous Game</h2>
              <h3 v-for="game in [...scoreCounter.scoreHistory.value].reverse()">Score {{ game[0] }} - {{ game[1] }} at {{ game[2] }} UTC</h3>
            </div>
            <button @click="showScores = false" class="saveButton">Done</button>
        </div>
    </div>
  </Transition>

  <div class="buttonArray">
    <RouterLink to="/play" class="playButton" id="play">
      Play
      <img src="/play.svg" id="playButtonImg">
    </RouterLink>
    <button class="playButton" id="scores" @click="showScores = true">
      Scores
      <img src="/trophy.svg" id="playButtonImg">
    </button>
    <button class="playButton" id="settings" @click="showSettings = true">
      Settings
      <img src="/settings.svg" id="playButtonImg">
    </button>
  </div>

  <h3 style="margin-bottom: 0;">Sample choices</h3>
  <div class="APIbuttonArray" v-if="loaded" style="margin-top: 1em;">
        <button v-for="choice in choices"
        class="choiceButton">
          <h3>{{ choice.code }}</h3>
          <p>{{ choice.name }}</p>
        </button>
    </div>

</template>

<script setup>

import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { settings } from '@/stores/settings';
import { scoreCounter } from '@/stores/scores';

const showSettings = ref(false);
const showScores = ref(false);
const loaded = ref(false);
const choices = ref();

onMounted(() => {
    loaded.value = false;
    try {
      getData();
    } catch (error) {
      console.warn(error);
    }
});

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

async function getData () {
    let data;
    try {
        const response = await fetch(`https://api.fxratesapi.com/currencies`);
        data = await response.json();
    } catch (error) {
        console.warn(error);
    }

    const allCurrencies = Object.entries(data);
    // console.log(allCurrencies)
    // console.log(allAvailableCurrencies)
    const pickedCurrencies = [];
    let rollNumber = 0;

    while (rollNumber < settings.choices.value) {
        let randomNumber = getRandomIntInclusive(0, allCurrencies.length - 1);
        const currencyName = allCurrencies[randomNumber][0];
        // console.log(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName))
        if (!pickedCurrencies.includes(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName)[1])) {
          rollNumber++;
          pickedCurrencies.push(allCurrencies.find((currencyArr) => currencyArr[0] == currencyName)[1]);
        }
    }

    choices.value = pickedCurrencies;
    loaded.value = true;
}

function decrement (type) {
  switch (type) {

    case "choices":
      if (settings.choices.value == settings.minChoices) {
        break;
      }
      settings.choices.value--;
      try {
        getData();
      } catch (error) {
        console.warn(error);
      }
      break;

    case "history":
      if (settings.history.value == settings.minHistory) {
        break;
      }
      settings.history.value--;
  }
}

function increment (type) {
  switch (type) {

    case "choices":
      if (settings.choices.value == settings.maxChoices) {
        break;
      }
      settings.choices.value++;
      try {
        getData();
      } catch (error) {
        console.warn(error);
      }
      break;

    case "history":
      if (settings.history.value == settings.maxHistory) {
        break;
      }
      settings.history.value++;
      break;
  }
}

</script>

<style scoped>

.APIbuttonArray {
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
  width: 15em;
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

#progressBar {
  width: 70%;
  height: 3em;
  background-color: var(--lightContent);
  border-radius: 3em;
  margin-top: 1em;
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

.saveButton {
  margin-top: auto;
  margin-bottom: 3vh;
  font-size: var(--h2);
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 0.5em;
  background-color: var(--aqua);
  transition: all 0.5s;
}
.saveButton:hover {
  transform: scale(1.1);
}

.settingsHolder {
  width: 80%;
}

.setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.incrementButtonArray {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 1vw;
}

.incrementButton {
  width: 5em;
  height: 5em;
  background-color: transparent;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
}
.incrementButton:hover {
  transform: scale(1.1);
}

#incrementText {
  width: 2em;
}

#incrementButtonImg {
  width: 4.9em;
  height: 4.9em;
}
 
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding-left: 4vh;
  padding-right: 4vh;
  border-radius: 10vh;
  gap: 2vw;
  background: linear-gradient(to bottom, transparent 5%, var(--darkHeader), var(--darkHeader))
}

#titleImg {
  height: 10em;
  width: 10em;
}

.buttonArray {
  background-color: var(--content);
  width: 35em;
  height: fit-content;
  padding-top: 5em;
  padding-bottom: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 5em;
  border-radius: 5em;
}

#play {
  background: linear-gradient(to bottom, rgb(161, 240, 187), var(--deepGreen));
}
#settings {
  background: linear-gradient(to bottom, rgb(161, 222, 240), var(--cyan));
}
#scores {
  background: linear-gradient(to bottom, rgb(239, 240, 161), var(--deepYellow));
}

.playButton {
  text-decoration: none;
  font-size: var(--h2);
  width: 6em;
  height: 1.5em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  overflow: hidden;
  filter: grayscale(0.6);
  transition: all 0.5s;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.playButton:hover {
    filter: grayscale(0);
    height: 3.25em;
}

#settings {
  height: 2em;
}
#settings:hover {
  filter: grayscale(0);
  height: 3.75em;
}
#scores {
  height: 2em;
}
#scores:hover {
  filter: grayscale(0);
  height: 3.75em;
}

#playButtonImg {
  width: 1.5em;
  height: 1.5em;
  margin-top: 0.25em;
}

.howToPlayBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.howToPlayMenu {
  width: 80em;
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

.grayscaleImg {
  filter: grayscale(1) brightness(0.5);
}

</style>