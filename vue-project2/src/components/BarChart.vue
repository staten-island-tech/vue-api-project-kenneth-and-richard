<template>
    <Bar
    :options="chartOptions"
    :data="chartData"/>
</template>

<script setup>

import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartOptions = {
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
}

const chartData = {
    labels: ["January", "February", "March"],
    datasets: [{
        label: "# of days",
        data: [40, 20, 12],
        
    }, {
        label: "# of aiogfhioasf",
        data: [50, 10, 35],
    }],
}

</script>

<style scoped>

</style>