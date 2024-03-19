
import { ref } from "vue";

const settings = {
    choices: ref(4),
    minChoices: 2,
    maxChoices: 100,
    history: ref(10),
    minHistory: 3,
    maxHistory: 15,
    help: ref(true),
    helpText: ref("Y"),
};

export { settings }
