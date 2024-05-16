<template>
  <q-dialog v-model="isDialogOpen">
    <q-card class="q-pa-xs">
      <q-card-section>
        <div class="text-h6" style="text-align: center; font-weight: bold">
          Výber úrovne vyriešenia notifikácie pre scenár {{ scenario.name }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row justify-center q-pa-lg">
          <q-btn size="lg" :style="notSolved ? 'background-color: #ffcccc;' : ''" @click="setNotSolved"
            >NEVYRIEŠENÁ</q-btn
          >
          <q-btn
            size="lg"
            :style="solutionInProgress ? 'background-color: #ffffcc;' : ''"
            @click="setSolutionInProgress"
            >V PROCESE RIEŠENIA</q-btn
          >
          <q-btn size="lg" :style="solved ? 'background-color: #ccffcc;' : ''" @click="setSolved">VYRIEŠENÁ</q-btn>
          <q-btn size="lg" :style="invalid ? 'background-color: #C0C0C0;' : ''" @click="setInvalid">NEPLATNÁ</q-btn>
          <q-btn size="lg" :style="needAssistance ? 'background-color: #E0B0FF;' : ''" @click="setNeedAssistance"
            >VYŽADUJE POMOC</q-btn
          >
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-pa-lg">
          <q-btn class="hover-blue" size="xl" color="primary" @click="levelSet">Spracovať</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { handleError } from '@/utils/error-handler';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import { Scenario } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import { useScenarioStore } from '@/stores/scenario-store';
import ScenarioLevelEnum from '@/models/enums/ScenarioLevelEnum';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  scenario: {
    type: Object as PropType<Scenario>,
    required: true,
  },
});

const notSolved = ref(true);
const solutionInProgress = ref(false);
const solved = ref(false);
const invalid = ref(false);
const needAssistance = ref(false);

const setNotSolved = () => {
  notSolved.value = true;
  solutionInProgress.value = false;
  solved.value = false;
  invalid.value = false;
  needAssistance.value = false;
};

const setSolutionInProgress = () => {
  notSolved.value = false;
  solutionInProgress.value = true;
  solved.value = false;
  invalid.value = false;
  needAssistance.value = false;
};

const setSolved = () => {
  notSolved.value = false;
  solutionInProgress.value = false;
  solved.value = true;
  invalid.value = false;
  needAssistance.value = false;
};

const setInvalid = () => {
  notSolved.value = false;
  solutionInProgress.value = false;
  solved.value = false;
  invalid.value = true;
  needAssistance.value = false;
};

const setNeedAssistance = () => {
  notSolved.value = false;
  solutionInProgress.value = false;
  solved.value = false;
  invalid.value = false;
  needAssistance.value = true;
};

const scenarioStore = useScenarioStore();
const { t } = useI18n();

const levelSet = (evt: Event) => {
  if (notSolved.value) {
    scenarioStore.resolveScenario(props.scenario.id, 'NOT_SOLVED');
  } else if (solutionInProgress.value) {
    scenarioStore.resolveScenario(props.scenario.id, 'SOLUTION_IN_PROGRESS');
  } else if (solved.value) {
    scenarioStore.resolveScenario(props.scenario.id, 'SOLVED');
  } else if (invalid.value) {
    scenarioStore.resolveScenario(props.scenario.id, 'INVALID');
  } else {
    scenarioStore.resolveScenario(props.scenario.id, 'NEED_ASSISTANCE');
  }
  isDialogOpen.value = false;
};
</script>

<style scoped>
.hover-blue {
  transition: background-color 0.3s;
}

.hover-blue:hover {
  background-color: rgb(65, 65, 238);
  color: rgb(255, 255, 255); /* Optionally, change text color on hover */
}
</style>
