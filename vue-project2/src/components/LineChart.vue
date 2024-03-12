<template>
    <Line v-if="loaded"
    :options="chartOptions"
    :data="chartData"/>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const loaded = ref(false);
const chartData = ref({});
const emit = defineEmits(["response"]);

const props = defineProps({
    Choices: Array,
    CorrectChoice: Object,
})

onMounted(() => {
    loaded.value = false;
    try {
        getData();
    } catch (error) {
        console.warn(error)
    }
});

async function getData () {
    try {
        // console.log(props.Choices)
        // console.log(props.CorrectChoice)
        
        const historicalRates = [];
        const historicalDates = [];
        
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        if (String(month).length == 1) {
            month = "0" + month;
        }

        for (let i = 0; i < 5; i++) {
            let year = date.getFullYear() - i;

            const correctChoiceData = await fetch(`https://api.fxratesapi.com/historical?api_key=fxr_demo_asdiksd21&date=${year}-${month}-${day}&currencies=${props.CorrectChoice.code}`)
            const data = await correctChoiceData.json();

            console.log(data, Object.entries(data.rates));

            historicalDates.push(`${day}/${month}/${year}`);
            historicalRates.push(Object.entries(data.rates)[0][1]);
        }

        // console.log(historicalDates, historicalRates)

        chartData.value.labels = historicalDates.slice().reverse();
        chartData.value.datasets = [{
            data: historicalRates.slice().reverse(),
            backgroundColor: "#ffff00", // point and fill color
            borderColor: "#000000", // line color
            fill: true,
            pointStyle: 'circle',
            pointRadius: 10,
            pointHoverRadius: 15
        }];

        loaded.value = true;
    } catch (error) {
        console.warn(error);
        emit("response", "error");
    }
}

const chartOptions = {
    responsive: true,
    animation: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: "4 Year History"
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: "Exchange Rate (USD -> Currency)"
            }
        }
    }
}

</script>

<style scoped>

</style>