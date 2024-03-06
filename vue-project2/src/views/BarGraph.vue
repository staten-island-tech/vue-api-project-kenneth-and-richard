<template>
    <div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const pokemon = ref("");
async function getPokemon(){
    let res = await fetch();
    let data = await res.json();
    pokemon.value = data.results;
    
}
</script>

<style lang="scss" scoped>

</style>