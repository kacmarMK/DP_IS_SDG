<template>
  <q-dialog v-model="openDialog" v-if="jobToRun">
    <q-card style="min-width: 350px" class="q-pa-sm">
      <q-card-section>
        <div class="text-h6">Run Job</div>
      </q-card-section>

      <q-form>
        <q-card-section class="q-pt-none column q-gutter-md">
          <q-select
            label="Recipe"
            ref="recipeRef"
            v-model="jobToRun.recipeId"
            :options="recipesAvailable"
            option-value="id"
            option-label="name"
            lazy-rules
            :rules="recipeRules"
            emit-value
            map-options
          >
          </q-select>
          <q-input
            label="Repetitions"
            ref="repetitionsRef"
            v-model="jobToRun.repetitions"
            type="number"
            lazy-rules
            :rules="repetitionRules"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup no-caps />
          <q-btn
            unelevated
            color="primary"
            label="Run Job"
            padding="6px 20px"
            no-caps
            @click="runJob"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDevicesStore } from '../stores/devices-store';
import recipeService from 'src/services/RecipeService';
import jobService from 'src/services/JobService';
import { Recipe } from 'src/models/Recipe';
import { QInput } from 'quasar';
import { JobToRun } from 'src/models/Job';
import { toast } from 'vue3-toastify';

const store = useDevicesStore();
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const openDialog = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
    resetDialog();
  },
});

const jobToRun = ref<JobToRun>();
const recipesAvailable = ref<Recipe[]>([]);
const selectedRecipe = ref<Recipe | null>(null);
async function getRecipes() {
  if (!store.device) return;
  try {
    recipesAvailable.value = await recipeService.getFullRecipesByDeviceType(
      store.device.type
    );
  } catch (e) {
    console.log(e);
  }
}
getRecipes();

async function runJob() {
  if (!jobToRun.value || !store.device) return;
  try {
    await jobService.runJobFromRecipe(jobToRun.value);
    openDialog.value = false;
  } catch (e) {
    toast.error('Error running job');
    console.log(e);
  }
}

function resetDialog() {
  jobToRun.value = {
    recipeId: '',
    deviceId: store.device?.uid ?? '',
    repetitions: 1,
    scheduledDays: [1, 2, 3, 4, 5, 6, 7],
    scheduledHour: 0,
    scheduledMinute: 0,
  };
  selectedRecipe.value = null;
}
resetDialog();

//Input validation
const repetitionsRef = ref<QInput>();
const repetitionRules = [
  (val: number) => (val && val > 0) || 'Repetitions must be greater than 0',
];

const recipeRef = ref<QInput>();
const recipeRules = [
  (val: string) => {
    if (!val) return 'Recipe is required';
    return true;
  },
];
</script>

<style lang="scss" scoped></style>
