
import { ref } from "vue";

const scoreCounter = {
  highScore: ref(0),
  currentScore: ref(0),
  scoreHistory: ref([]),
};

export { scoreCounter };
