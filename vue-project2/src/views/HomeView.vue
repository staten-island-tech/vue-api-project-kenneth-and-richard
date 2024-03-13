<template>
  <div class="title">
    <img src="/money.svg" id="titleImg">
    <h1>Guess the <span style="color: var(--deepGreen)">$$$</span></h1>
  </div>

  <div class="buttonArray">
    <RouterLink to="/play" class="playButton" id="play">
      Play
      <img src="/play.svg" id="playButtonImg">
    </RouterLink>
    <button class="playButton" id="settings" @click="showSettings = true">
      Settings
      <img src="/settings.svg" id="playButtonImg">
    </button>
  </div>

</template>

<script setup>

import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const showSettings = ref(false);

</script>

<style scoped>

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

.playButton {
  text-decoration: none;
  font-size: var(--h2);
  width: 6em;
  height: 1.5em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  overflow: hidden;
  filter: grayscale(0.5);
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
  text-decoration: none;
  font-size: var(--h2);
  width: 6em;
  height: 2em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  overflow: hidden;
  filter: grayscale(0.5);
  transition: all 0.5s;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#settings:hover {
  filter: grayscale(0);
  height: 3.75em;
}

#playButtonImg {
  width: 1.5em;
  height: 1.5em;
  margin-top: 0.25em;
}

</style>