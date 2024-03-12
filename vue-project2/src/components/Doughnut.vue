<template>
    <div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const loaded = ref(false);
const currencyData = ref({});
const emit = defineEmits(["response"]);

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
        const historicalRates = [];
        const historicalCurrencies = [];
        const correctChoiceData = await fetch(`https://api.fxratesapi.com/currencies?api_key=fxr_demo_asdiksd21&&currencies=${props.CorrectChoice.code}`)
        const data = await correctChoiceData.json();

        currencyData.value.labels = historicalCurrencies;
        currencyData.value.datasets = [{
        }];

        loaded.value = true;
    } catch (error) {
        console.warn(error);
        emit("response", "error");
    }
}

</script>

<style lang="scss" scoped>

</style>