<template>
  <div class="title">
    <img src="/money.svg" id="titleImg">
    <h1>Guess the <span style="color: var(--deepGreen)">$$$</span></h1>
  </div>

  <div class="buttonArray">
    <RouterLink to="/play" class="playButton">
      Play
      <img src="/play.svg" id="playButtonImg">
    </RouterLink>
  </div>

</template>

<script setup>

import { ref } from 'vue';
import { RouterLink } from 'vue-router';

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

.playButton {
  background: linear-gradient(to bottom, rgb(240, 227, 161), var(--deepYellow));
  text-decoration: none;
  width: 4em;
  height: 1.5em;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  font-size: var(--h2);
  overflow: hidden;
  filter: grayscale(0.5);
  transition: all 0.5s;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.playButton:hover {
    transform: scale(1.1);
    filter: grayscale(0);
    width: 6em;
    height: 3.25em;
}

#playButtonImg {
  width: 1.5em;
  height: 1.5em;
  margin-top: 0.25em;
}

</style>