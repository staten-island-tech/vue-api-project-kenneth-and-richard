<template>
    <h1 v-if="error">Error</h1>
    
    <LineChart :Choices="choices"
    :CorrectChoice="correctChoice"
    v-if="loaded"
    @response="error = true"/>

</template>

<script setup>

import LineChart from '@/components/LineChart.vue';
import { ref, onMounted } from 'vue';

const loaded = ref(false);
const choices = ref();
const correctChoice = ref();
const error = ref(false);

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
    try {
        const response = await fetch(`https://api.fxratesapi.com/currencies`);
        const data = await response.json();
        // console.log(Object.entries(data))

        const allCurrencies = Object.entries(data).filter((currency) => currency[1].code.length == 3);
        const pickedCurrencies = [];

        for (let i = 0; i < 3; i++) {
            pickedCurrencies.push(allCurrencies[getRandomIntInclusive(0, allCurrencies.length - 1)][1]);
        }

        choices.value = pickedCurrencies;
        correctChoice.value = pickedCurrencies[getRandomIntInclusive(0, pickedCurrencies.length - 1)];
        loaded.value = true;
    } catch (error) {
        console.warn(error);
    }
}

</script>

<style scoped>



</style>