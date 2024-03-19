<template>
    <Doughnut v-if="loaded"
    :options="chartOptions"
    :data="chartData"
    id="chart"/>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend);

const loaded = ref(false);
const chartData = ref({});
const backgroundColors = ["#3d4b61", "#90ff54"];
const emit = defineEmits(["response"]);

const props = defineProps({
    Choices: Array,
    CorrectChoice: Object
});

onMounted(() => {
    loaded.value = false;
    try {
        getData();
    } catch (error) {
        console.warn(error)
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
        const response = await fetch(`https://api.fxratesapi.com/latest?api_key=fxr_demo_asdiksd21&base=USD`);
        data = await response.json();
    } catch (error) {
        console.warn(error);
        emit("response", "error");
    }

    chartData.value.labels = [];
    chartData.value.datasets = [{
        backgroundColor: [],
        data: [],
        borderColor: "#000000"
    }];

    for (let currency of props.Choices) {

        if (Object.entries(data.rates).find((arr) => arr[0] == currency.code)[1] <= 1.5 || currency.code == props.CorrectChoice.code) {
            chartData.value.datasets[0].data.push(Object.entries(data.rates).find((arr) => arr[0] == currency.code)[1]);
        } else {
            chartData.value.datasets[0].data.push(Math.round(Object.entries(data.rates).find((arr) => arr[0] == currency.code)[1]));
        }
        
        if (currency.code == props.CorrectChoice.code) {
            chartData.value.datasets[0].backgroundColor.push(backgroundColors[1]);
            chartData.value.labels.push("Currency W");
        } else {
            chartData.value.datasets[0].backgroundColor.push(backgroundColors[0]);
            chartData.value.labels.push("Currency X");
        }
    }

   
    for (let rate in chartData.value.datasets[0].data) {
        
        if (chartData.value.datasets[0].data[rate] >= 5 * Object.entries(data.rates).find((arr) => arr[0] == props.CorrectChoice.code)[1]) {
            chartData.value.datasets[0].data[rate] = Math.floor(5 * Object.entries(data.rates).find((arr) => arr[0] == props.CorrectChoice.code)[1]);
            chartData.value.labels[rate] += " (rounded down)";

        } else if (chartData.value.datasets[0].data[rate] <= Object.entries(data.rates).find((arr) => arr[0] == props.CorrectChoice.code)[1] / 5) {
            chartData.value.datasets[0].data[rate] = Math.ceil(Object.entries(data.rates).find((arr) => arr[0] == props.CorrectChoice.code)[1] / 5);
            chartData.value.labels[rate] += " (rounded up)";
        }
    }

    // shuffle the shit
    const shuffleIndex = [];
    const shuffleLabels = [];
    const shuffleColors = [];
    const shuffleData = [];
    let increment = 0;
    while (increment <= chartData.value.labels.length - 1) {
        let index = getRandomIntInclusive(0, chartData.value.labels.length - 1);
        if (!shuffleIndex.includes(index)) {
            shuffleIndex.push(index);
            increment++;
        }
    }
    for (let i of shuffleIndex) {
        shuffleLabels.push(chartData.value.labels[i]);
        shuffleColors.push(chartData.value.datasets[0].backgroundColor[i]);
        shuffleData.push(chartData.value.datasets[0].data[i]);
    }

    chartData.value.labels = shuffleLabels;
    chartData.value.datasets[0].backgroundColor = shuffleColors;
    chartData.value.datasets[0].data = shuffleData;

    loaded.value = true;
}

/*const chartData = {
    labels: ["a", "b", "c", "D"],
    datasets: [
        {
        backgroundColor: ['#90ff54', '#ffffff'],
        data: [5, 10, 20, 30]
        }   
    ]

}*/

const chartOptions = {
    responsive: true,
    aspectRatio: 1,
    animation: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    },
}

</script>

<style scoped>

#chart {
    width: 10em;
    height: 10em;
}

</style>