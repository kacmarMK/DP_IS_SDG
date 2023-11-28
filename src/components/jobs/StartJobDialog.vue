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
          <div>Schedule</div>
          <q-btn-group unelevated>
            <q-btn
              v-for="(button, index) in dayButtons"
              :key="index"
              :label="button.label"
              :color="button.onOff ? 'primary' : 'grey'"
              @click="dayButtons[index].onOff = !dayButtons[index].onOff"
            ></q-btn>
          </q-btn-group>
          <q-input
            v-model="scheduledTime"
            mask="time"
            fill-mask="-"
            :rules="['time']"
            label="Scheduled Time"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="scheduledTime" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
import { useDevicesStore } from '@/stores/devices-store';
import recipeService from '@/services/RecipeService';
import jobService from '@/services/JobService';
import { Recipe } from '@/models/Recipe';
import { QInput } from 'quasar';
import { JobToRun } from '@/models/Job';
import { toast } from 'vue3-toastify';
import { parse } from 'date-fns';

const store = useDevicesStore();
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'jobStarted']);

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
    jobToRun.value.scheduledDays = selectedDays.value;

    const date = parse(scheduledTime.value, 'HH:mm', new Date());

    jobToRun.value.scheduledHour = date.getHours();
    jobToRun.value.scheduledMinute = date.getMinutes();

    await jobService.runJobFromRecipe(jobToRun.value);
    openDialog.value = false;
    toast.success('Job started');
    emit('jobStarted');
  } catch (e) {
    toast.error('Error running job');
    console.log(e);
  }
}

const dayButtons = ref([
  { label: 'Mon', value: 1, onOff: false },
  { label: 'Tue', value: 2, onOff: false },
  { label: 'Wed', value: 3, onOff: false },
  { label: 'Thu', value: 4, onOff: false },
  { label: 'Fri', value: 5, onOff: false },
  { label: 'Sat', value: 6, onOff: false },
  { label: 'Sun', value: 7, onOff: false },
]);

const selectedDays = computed(() => {
  return dayButtons.value
    .filter((button) => button.onOff)
    .map((button) => button.value);
});

const scheduledTime = ref();

function resetDialog() {
  jobToRun.value = {
    recipeId: '',
    deviceId: store.device?.uid ?? '',
    repetitions: 1,
    scheduledDays: selectedDays.value,
    scheduledHour: 0,
    scheduledMinute: 0,
  };
  dayButtons.value.forEach((button) => (button.onOff = false));
  scheduledTime.value = null;
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
