<template>
    <Bar v-if="loaded"
    :data="chartData"/>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const loaded = ref(false);
const chartData = ref();

async function getData () {
    const { userlist } = await fetch('https://data.cityofnewyork.us/resource/uip8-fykc.json');
    chartData.value = userlist;
    loaded.value = true;
}

onMounted(() => {
    loaded.value = false;
    try {
        getData();
    } catch (error) {
        console.log(error)
    }
});

/*const chartOptions = {
    responsive: true,
    animation: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        }
    }
}*/

/*const chartData = {
    labels: ["January", "February", "March"],
    datasets: [{
        label: "# of days",
        data: [40, 20, 12],
        
    }, {
        label: "# of aiogfhioasf",
        data: [50, 10, 35],
    }],
}*/

</script>

<style scoped>

</style>