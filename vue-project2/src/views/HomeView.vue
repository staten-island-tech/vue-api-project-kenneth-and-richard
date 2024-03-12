<template>
  <div>

  </div>
</template>

<script setup>

/*import { getData } from '@/stores/data';

console.log(getData)*/

import { ref, onBeforeMount } from 'vue';

const pokemon = ref("");
async function getPokemon () {
  let res = await fetch("link");
  let data = await res.json();
  pokemon.value = data.results;
}

onBeforeMount(() => {
  getPokemon();
});

</script>

<style scoped>

</style>