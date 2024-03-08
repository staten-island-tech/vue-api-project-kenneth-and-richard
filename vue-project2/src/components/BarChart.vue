<template>
    <Bar v-if="loaded"
    :options="chartOptions"
    :data="chartData"/>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const loaded = ref(false);
const chartData = ref({});

onMounted(() => {
    loaded.value = false;
    try {
        getData();
    } catch (error) {
        console.log(error)
    }
});

async function getData () {
    try {
        const response = await fetch(`https://data.cityofnewyork.us/resource/uip8-fykc.json?$limit=10000`);
        const data = await response.json();

        chartData.value.labels = [];
        chartData.value.datasets = [{
            data: []
        }];

        for (let criminal of data) {
            if (!chartData.value.labels.includes(criminal.perp_race)) {
                chartData.value.labels.push(criminal.perp_race);
            }
        }

        for (let race of chartData.value.labels) {
            let peopleInRace = 0;
            for (let criminal of data) {
                if (criminal.perp_race == race) {
                    peopleInRace++;
                }
            }
            chartData.value.datasets[0].data.push(peopleInRace);
        }

        loaded.value = true;
    } catch (error) {
        console.warn(error);
    }
}

const chartOptions = {
    responsive: true,
    animation: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    }
}

</script>

<style scoped>

</style>