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
    try {
        const response = await fetch(`https://api.fxratesapi.com/latest?api_key=fxr_demo_asdiksd21&base=USD`);
        data = await response.json();
        console.log(data)
    } catch (error) {
        console.warn(error);
    }

    chartData.value.labels = [];
    chartData.value.datasets = {
        backgroundColor: [],
        data: []
    };

    for (let currency of props.Choices) {
        chartData.value.labels.push(currency.code);
        chartData.value.datasets.data.push(Object.entries(data.rates)[0][1]);
        if (currency.code == props.CorrectChoice.code) {
            chartData.value.datasets.backgroundColor.push(backgroundColors[1]);
        } else {
            chartData.value.datasets.backgroundColor.push(backgroundColors[0]);
        }
    }

}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
}

</script>

<style scoped>

#chart {
    width: 50em;
}

</style>