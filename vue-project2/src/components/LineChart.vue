<template>
    <Line v-if="loaded"
    :options="chartOptions"
    :data="chartData"
    id="chart"/>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { settings } from '@/stores/settings';

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
    const historicalRates = [];
    const historicalDates = [];

    try {
        console.log(props.Choices)
        console.log(props.CorrectChoice)

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        if (String(month).length == 1) {
            month = "0" + month;
        }

        for (let i = 0; i < settings.history.value + 1; i++) {
            let year = date.getFullYear() - i;

            const correctChoiceData = await fetch(`https://api.fxratesapi.com/historical?api_key=fxr_demo_asdiksd21&date=${year}-${month}-${day}&currencies=${props.CorrectChoice.code}`);
            const data = await correctChoiceData.json();

            // console.log(Object.entries(data.rates));

            if (Object.entries(data.rates).length != 0) {
                historicalDates.push(year);
                historicalRates.push(Object.entries(data.rates)[0][1]);
            }
        }

        // console.log(historicalDates, historicalRates)
    } catch (error) {
        console.warn(error);
        emit("response", "error");
    }

    chartData.value.labels = historicalDates.slice().reverse();
    chartData.value.datasets = [{
        data: historicalRates.slice().reverse(),
        backgroundColor: "#90ff54", // point and fill color
        borderColor: "#182b0d", // line color
        fill: true,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 10
    }];

    loaded.value = true;
}

const chartOptions = {
    responsive: false,
    animation: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    },
    interaction: {
        mode: "index",
        intersect: false
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: "Year-by-year change",
                color: "#ffffff"
            },
            ticks: {
                color: "#ffffff"
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: "Exchange Rate (USD -> Currency)",
                color: "#ffffff"
            },
            ticks: {
                color: "#ffffff"
            }
        }
    }
}

</script>

<style scoped>

#chart {
    width: 50em;
}

</style>