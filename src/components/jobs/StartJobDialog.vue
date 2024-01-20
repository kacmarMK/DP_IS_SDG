<template>
  <q-dialog v-if="jobToRun" v-model="openDialog">
    <q-card style="min-width: 350px" class="q-pa-sm">
      <q-card-section>
        <div class="text-h6">{{ t('job.run_job') }}</div>
      </q-card-section>
      <q-form>
        <q-card-section class="q-pt-none column q-gutter-md">
          <q-select
            ref="recipeRef"
            v-model="jobToRun.recipeId"
            :label="t('recipe.title')"
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
            ref="repetitionsRef"
            v-model="jobToRun.repetitions"
            :label="t('job.repetitions')"
            type="number"
            lazy-rules
            :rules="repetitionRules"
          />
          <div>{{ t('job.schedule') }}</div>
          <q-btn-group unelevated>
            <q-btn
              v-for="(button, index) in dayButtons"
              :key="index"
              :label="button.label.toUpperCase()"
              :color="button.onOff ? 'primary' : 'grey'"
              @click="dayButtons[index].onOff = !dayButtons[index].onOff"
            ></q-btn>
          </q-btn-group>
          <q-input
            v-model="scheduledTime"
            mask="time"
            fill-mask="-"
            :rules="['time']"
            :label="t('job.scheduled_time')"
          >
            <template #append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="scheduledTime" format24h>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        :label="t('global.close')"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
          <q-btn
            unelevated
            color="primary"
            :label="t('job.run_job')"
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
import { PropType, computed, ref } from 'vue';
import recipeService from '@/services/RecipeService';
import jobService from '@/services/JobService';
import { Recipe } from '@/models/Recipe';
import { QInput } from 'quasar';
import { JobToRun } from '@/models/Job';
import { toast } from 'vue3-toastify';
import { parse } from 'date-fns';
import { handleError } from '@/utils/error-handler';
import { Device } from '@/models/Device';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
});
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
  if (!props.device) return;
  try {
    recipesAvailable.value = await recipeService.getFullRecipesByDeviceType(
      props.device.type,
    );
  } catch (e) {
    console.log(e);
  }
}
getRecipes();

async function runJob() {
  if (!jobToRun.value || !props.device) return;
  try {
    jobToRun.value.scheduledDays = selectedDays.value;

    const date = parse(scheduledTime.value, 'HH:mm', new Date());

    jobToRun.value.scheduledHour = date.getHours();
    jobToRun.value.scheduledMinute = date.getMinutes();

    await jobService.runJobFromRecipe(jobToRun.value);
    openDialog.value = false;
    toast.success(t('job.toasts.start_success'));
    emit('jobStarted');
  } catch (error) {
    handleError(error, t('job.toasts.start_failed'));
  }
}

const dayButtons = ref([
  { label: t('days_short.mon'), value: 1, onOff: false },
  { label: t('days_short.tue'), value: 2, onOff: false },
  { label: t('days_short.wed'), value: 3, onOff: false },
  { label: t('days_short.thu'), value: 4, onOff: false },
  { label: t('days_short.fri'), value: 5, onOff: false },
  { label: t('days_short.sat'), value: 6, onOff: false },
  { label: t('days_short.sun'), value: 7, onOff: false },
]);

const selectedDays = computed(() => {
  return dayButtons.value
    .filter((button) => button.onOff)
    .map((button) => button.value);
});

const scheduledTime = ref();

function resetDialog() {
  const now = new Date();
  const day = now.getDay() || 7;
  const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  jobToRun.value = {
    recipeId: '',
    deviceId: props.device?.uid ?? '',
    repetitions: 1,
    scheduledDays: [day],
    scheduledHour: now.getHours(),
    scheduledMinute: now.getMinutes(),
  };
  dayButtons.value.forEach((button) => (button.onOff = false));
  scheduledTime.value = formattedTime;
  selectedRecipe.value = null;

  dayButtons.value[day - 1].onOff = true;
}
resetDialog();

//Input validation
const repetitionsRef = ref<QInput>();
const repetitionRules = [
  (val: number) => (val && val > 0) || t('job.rules.repetitions_min'),
];

const recipeRef = ref<QInput>();
const recipeRules = [
  (val: string) => {
    if (!val) return t('job.rules.recipe_required');
    return true;
  },
];
</script>

<style lang="scss" scoped></style>
