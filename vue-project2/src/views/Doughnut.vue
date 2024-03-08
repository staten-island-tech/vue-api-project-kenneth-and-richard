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
    } catch (error) {
        console.warn(error);
    }
}
const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};
const config = {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Doughnut Chart'
      }
    }
  },
};

</script>

<style lang="scss" scoped>

</style>