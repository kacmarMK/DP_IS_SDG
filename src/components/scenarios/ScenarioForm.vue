<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <div class="row q-col-gutter-x-xs q-col-gutter-y-sm justify-between q-mx-xl">
        <q-card class="q-pa-sm q-mt-md">
          <div>
            <div class="text-weight-medium text-h6 row justify-center">{{ t('scenario.days_active') }}</div>
            <q-option-group
              v-model="scenarioStore.scenarioFrame.activeAtDay"
              :options="dayOptions"
              :disabled="isReadonly"
              type="checkbox"
              class="right-checkboxes q-pa-md q-mt-sm"
            />
          </div>
        </q-card>

        <q-card class="q-pa-lg q-mt-md">
          <q-input
            v-model="scenarioStore.scenarioFrame.name"
            filled
            :readonly="isReadonly"
            :label="t('global.name')"
            lazy-rules
            :rules="[(val: string | any[]) => (val && val.length > 0) || t('global.rules.required')]"
          />

          <div class="q-pb-md">
            <q-select
              v-model="devicesFromOptions"
              filled
              multiple
              :readonly="isReadonly"
              :options="deviceOptions"
              :label="t('device.label', 2)"
            />
          </div>

          <div class="text-weight-medium text-h6 row justify-center">
            <q-input
              v-model.number="validatedMutedUntil"
              type="number"
              :readonly="isReadonly"
              filled
              :label="t('scenario.form.muted_until')"
              style="max-width: 200px"
            />
          </div>
          <div class="q-pt-xl">
            <q-checkbox
              v-model="scenarioStore.scenarioFrame.deactivated"
              left-label
              :disabled="isReadonly"
              :label="t('scenario.form.scenario_active')"
            />
            <q-checkbox
              v-model="scenarioStore.scenarioFrame.isAlreadyTriggered"
              left-label
              :disabled="isReadonly"
              :label="t('scenario.form.scenario_triggered')"
              class="q-ml-lg"
            />
          </div>
        </q-card>

        <q-card class="q-px-md q-mt-md">
          <div style="max-width: 150px">
            <div class="text-weight-medium text-h6 row justify-center">{{ t('scenario.hours_active') }}</div>
            <q-option-group
              v-model="scenarioStore.scenarioFrame.activeAtHour"
              size="xs"
              :options="hourOptions"
              type="checkbox"
              right-label
              inline
              :disabled="isReadonly"
              dense
              class="right-checkboxes q-pa-lg"
            />
          </div>
        </q-card>
      </div>
      <div class="row q-col-gutter-x-xs q-col-gutter-y-sm">
        <q-card class="q-my-lg full-width">
          <div></div>
        </q-card>
      </div>

      <div class="q-mt-lg row justify-center">
        <q-btn
          v-if="showCreateButton"
          :label="buttonLabel"
          type="submit"
          color="primary"
          size="lg"
          style="min-width: 150px"
        />
        <q-btn
          v-if="showRefreshButton"
          :label="t('global.refresh')"
          type="reset"
          color="secondary"
          flat
          style="min-width: 150px"
          size="lg"
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, toRefs, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';
import { Scenario } from '@/models/Scenario';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const scenarioStore = useScenarioStore();
const props = defineProps({
  mode: {
    type: String,
    default: 'create',
  },
  scenarioData: {
    type: Object as PropType<Scenario>,
    default: null,
  },
});
const isReadonly = computed(() => props.mode === 'detail');
scenarioStore.mode = props.mode;
deviceStore.devices.refresh();

const deviceOptions = getDeviceOptions();
const { scenarioData } = toRefs(props);

// A function to update the scenarioFrame ref with scenarioData
const fillScenarioFrame = (data: Scenario) => {
  scenarioStore.scenarioFrame.rules = data.rules || ' ';
  scenarioStore.scenarioFrame.name = data.name || '';
  scenarioStore.scenarioFrame.devices = data.devices || [];
  scenarioStore.scenarioFrame.deactivated = data.deactivated || false;
  scenarioStore.scenarioFrame.isAlreadyTriggered = data.isAlreadyTriggered || false;
  scenarioStore.scenarioFrame.mutedUntil = data.mutedUntil || 0;
  scenarioStore.scenarioFrame.activeAtDay = data.activeAtDay || [];
  scenarioStore.scenarioFrame.activeAtHour = data.activeAtHour || [];
};

fillScenarioFrame(scenarioData.value);
// Watch for changes to scenarioData and update scenarioFrame accordingly
watch(
  scenarioData,
  (newValue) => {
    fillScenarioFrame(newValue);
  },
  { deep: true },
); // deep watch to detect nested changes
// Computed property for the button label
const buttonLabel = computed(() => {
  return scenarioStore.mode === 'edit' ? t('global.edit') : t('global.create');
});

// Function to determine if the create button should be shown
const showCreateButton = computed(() => {
  return scenarioStore.mode === 'create' || scenarioStore.mode === 'edit';
});

// Function to determine if the refresh button should be shown
const showRefreshButton = computed(() => {
  return scenarioStore.mode === 'create';
});

const validatedMutedUntil = computed({
  get: () => scenarioStore.scenarioFrame.mutedUntil,
  set: (value) => {
    if (typeof value !== 'undefined' && value < 0) {
      // If negative number, set it to 0
      scenarioStore.scenarioFrame.mutedUntil = 0;
    } else {
      // Otherwise, set to the provided value
      scenarioStore.scenarioFrame.mutedUntil = value;
    }
  },
});

// Watch for changes in the input value and validate it
watch(
  () => scenarioStore.scenarioFrame.mutedUntil,
  (newValue) => {
    if (typeof newValue !== 'undefined' && newValue < 0) {
      // If negative number, set it to 0
      scenarioStore.scenarioFrame.mutedUntil = 0;
    }
  },
);

const dayOptions = computed(() => [
  { label: t('scenario.day_options.option1'), value: 1 },
  { label: t('scenario.day_options.option2'), value: 2 },
  { label: t('scenario.day_options.option3'), value: 3 },
  { label: t('scenario.day_options.option4'), value: 4 },
  { label: t('scenario.day_options.option5'), value: 5 },
  { label: t('scenario.day_options.option6'), value: 6 },
  { label: t('scenario.day_options.option7'), value: 7 },
]);

const hourOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
];

let devicesFromOptions = ref([]);

function getDeviceOptions() {
  return deviceStore.devices.data?.map((device) => ({
    label: device.name,
    value: device,
  }));
}

interface DeviceOption {
  label: string;
  value: Device;
}

function extractIDFromArray(arrayOfObjects: DeviceOption[]): string[] {
  return arrayOfObjects.map((item) => item.value.uid);
}

function onSubmit() {
  scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
  scenarioStore.createScenario();
}

function onReset() {
  scenarioStore.scenarioFrame.rules = ' ';
  scenarioStore.scenarioFrame.name = '';
  devicesFromOptions = ref([]);
  scenarioStore.scenarioFrame.deactivated = false;
  scenarioStore.scenarioFrame.isAlreadyTriggered = false;
  scenarioStore.scenarioFrame.mutedUntil = 0;
  scenarioStore.scenarioFrame.activeAtDay = [];
  scenarioStore.scenarioFrame.activeAtHour = [];
}
</script>

<style lang="scss" scoped>
.right-checkboxes .q-checkbox {
  justify-content: flex-end;
}
</style>
