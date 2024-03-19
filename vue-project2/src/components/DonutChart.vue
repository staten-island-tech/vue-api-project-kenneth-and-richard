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
const backgroundColors = ["#3d4b61", "#90ff54"]

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

async function getData () {
    let data;
    let index = 1;
    try {
        const response = await fetch(`https://api.fxratesapi.com/latest?api_key=fxr_demo_asdiksd21&base=USD`);
        data = await response.json();
        console.log(data)
    } catch (error) {
        console.warn(error);
    }

    chartData.value.labels = [];
    chartData.value.datasets = [{
        backgroundColor: [],
        data: []
    }];

    for (let currency of props.Choices) {
        chartData.value.labels.push("Currency " + index);
        index++;
        chartData.value.datasets[0].data.push(Object.entries(data.rates).find((arr) => arr[0] == currency.code)[1]);
        if (currency.code == props.CorrectChoice.code) {
            chartData.value.datasets[0].backgroundColor.push(backgroundColors[1]);
        } else {
            chartData.value.datasets[0].backgroundColor.push(backgroundColors[0]);
        }
    }
    console.log(chartData.value)

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