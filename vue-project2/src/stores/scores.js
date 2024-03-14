
import { ref } from "vue";

const scoreCounter = {
  highScore: ref(1),
  currentScore: ref(0),
  scoreHistory: ref([]),
};

export { scoreCounter };
