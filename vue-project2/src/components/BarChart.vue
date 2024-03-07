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
        const response = await fetch('https://data.cityofnewyork.us/resource/uip8-fykc.json');
        chartData.value.labels = [];
        chartData.value.datasets = [];
        const data = await response.json();
        const allRaces = {};
        for (let criminal of data) {
            // for each race make a variable
            // if race == race then increment variable
            // push those varaibles to datasets
            if (!chartData.value.labels.includes(criminal.perp_race)) {
                const race = criminal.perp_race;
                chartData.value.labels.push(criminal.perp_race);
                if (!allRaces.race) {/*here*/
                    allRaces.race = 0;
                }
                allRaces.race++;
            }
        }
        console.log(allRaces)

        for (let race of chartData.value.labels) {
            let increment = 0;
            for (let criminal of data) {

            }
        }

        console.log(chartData.value)



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
            enabled: false
        }
    }
}

/*const chartData = {
    labels: ["January", "February", "March"],
    datasets: [{
        label: "# of days",
        data: {
            name: "afjkauisf",
            perp_race: "afaif",
        },
        
    }, {
        label: "# of aiogfhioasf",
        data: {
            name: "aduigfiifa",
            perp_race: "aduifhaif",
        },
    }],
}*/

</script>

<style scoped>

</style>