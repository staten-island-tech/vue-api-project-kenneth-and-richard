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

const props = defineProps({
    Choices: Array,
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
        const currentRates = [];
        const currencies = [];
        
        const correctChoiceData = await fetch(`https://api.fxratesapi.com/latest?base=USD=${props.Choices}`)
        const data = await correctChoiceData.json();
       
        currentRates.push(Object.entries(data.rates)[0][1]);
        Choices.value.labels = currencies;
        chartData.value.datasets = [{
            data: currentRates,
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