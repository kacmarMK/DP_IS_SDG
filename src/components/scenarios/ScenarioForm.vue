<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
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
              :label="t('scenario.form.scenario_active')"
            />
            <q-checkbox
              v-model="scenarioStore.scenarioFrame.isAlreadyTriggered"
              left-label
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
              dense
              class="right-checkboxes q-pa-lg"
            />
          </div>
        </q-card>
      </div>
      <!-- This button will only show when 'showConditions' is false -->
      <div class="row justify-center q-pa-xl q-mt-xl">
        <q-btn
          v-if="!showConditions"
          label="Add conditions"
          padding="xl"
          color="green"
          size="20px"
          :icon="mdiPlusCircleOutline"
          :icon-right="mdiCallSplit"
          @click="showConditions = true"
        ></q-btn>
      </div>

      <!-- The q-card and 'Remove conditions' button will only show when 'showConditions' is true -->
      <div v-if="showConditions">
        <q-card class="full-width">
          <div class="text-weight-medium q-pa-lg row justify-center" style="font-weight: 600; font-size: 30px">
            {{ t('scenario.conditions') }}
          </div>
          <div class="row justify-center q-ma-sm" style="min-height: 300px; overflow-y: auto">
            <q-card class="q-pa-lg full-width" style="z-index: 1">
              <div
                class="col"
                style="
                  background-color: #f5f5f5;
                  padding: 20px;
                  border-radius: 8px;
                  font-family: monospace;
                  white-space: pre;
                  overflow-x: auto;
                  border: 1px solid #ddd;
                  font-size: large;
                "
              >
                <span class="q-pa-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >if</span
                >
                (
                <div class="row q-gutter-sm q-mx-md">
                  <div class="col">
                    <q-select
                      v-model="selectVariable1"
                      :options="conditonVariable1"
                      label="Value / Constant"
                      dense
                    ></q-select>
                  </div>
                  <div class="col-2">
                    <q-select v-model="selectOperand" :options="operands" label="Operand" dense></q-select>
                  </div>
                  <div class="col">
                    <q-select
                      v-model="selectVariable2"
                      :options="conditonVariable2"
                      label="Value / Constant"
                      dense
                    ></q-select>
                  </div>
                </div>
                <div class="row justify-center q-mt-md">
                  <q-btn size="17px" label="+" round dense color="secondary"></q-btn>
                </div>
                )
                <span
                  class="q-pa-sm q-ma-sm"
                  style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >then</span
                >
                {
                <br />
                <q-select
                  v-model="selectThen"
                  :options="optionsThen"
                  label="Action / Condition"
                  dense
                  class="q-ma-md q-px-xl"
                ></q-select>
                <br />
                }
                <span class="q-pa-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >else</span
                >
                {
                <br />
                <q-select
                  v-model="selectElse"
                  :options="optionsElse"
                  label="Action / Condition"
                  dense
                  class="q-ma-md q-px-xl"
                ></q-select>
                <br />}
              </div>
            </q-card>
          </div>
          <div class="row justify-center q-pb-lg">
            <q-btn
              label="Remove conditions"
              padding="xl"
              color="red"
              size="20px"
              :icon="mdiMinusCircleOutline"
              :icon-right="mdiCallSplit"
              @click="showConditions = false"
            ></q-btn>
          </div>
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
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import { useRoute } from 'vue-router';
import { mdiCallSplit, mdiPlusCircleOutline, mdiMinusCircleOutline } from '@quasar/extras/mdi-v6';

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
    default: ref<ScenarioFrame>({
      rules: ' ',
      name: '',
      devices: [],
      deactivated: false,
      isAlreadyTriggered: false,
      mutedUntil: 0,
      activeAtDay: [],
      activeAtHour: [],
    }),
  },
});
const isReadonly = computed(() => {
  return props.mode === 'detail';
});

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
  props.scenarioData,
  (newValue) => {
    fillScenarioFrame(newValue);
  },
  { deep: true, immediate: true },
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
const editedScenario = ref<Scenario>();
const route = useRoute();
if (scenarioStore.mode == 'edit') getScenario();

async function onSubmit() {
  if (scenarioStore.mode == 'create') {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    scenarioStore.createScenario();
  } else {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    setEditedScenario();

    console.log(editedScenario);
    if (editedScenario.value) {
      scenarioStore.editScenario(editedScenario.value);
    }
  }
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

function setEditedScenario() {
  if (editedScenario.value) {
    editedScenario.value.rules = scenarioStore.scenarioFrame.rules || ' ';
    editedScenario.value.name = scenarioStore.scenarioFrame.name || '';
    editedScenario.value.devices = scenarioStore.scenarioFrame.devices;
    editedScenario.value.deactivated = scenarioStore.scenarioFrame.deactivated || false;
    editedScenario.value.isAlreadyTriggered = scenarioStore.scenarioFrame.isAlreadyTriggered || false;
    editedScenario.value.mutedUntil = scenarioStore.scenarioFrame.mutedUntil || 0;
    editedScenario.value.activeAtDay = scenarioStore.scenarioFrame.activeAtDay || [];
    editedScenario.value.activeAtHour = scenarioStore.scenarioFrame.activeAtHour || [];
  }
}

async function getScenario() {
  const scenarioId = route.params.id.toString();
  editedScenario.value = await ScenarioService.getScenarioById(scenarioId);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
const selectVariable1 = ref('');
const selectOperand = ref('');
const selectVariable2 = ref('');
const selectThen = ref('');
const selectElse = ref('');
const conditonVariable1 = [{ label: 'Option 1', value: '1' }];
const operands = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
];
const conditonVariable2 = [{ label: 'Option 3', value: '3' }];
const optionsThen = [{ label: 'Option 4', value: '4' }];
const optionsElse = [{ label: 'Option 5', value: '5' }];

const showConditions = ref(false);
</script>

<style lang="scss" scoped>
.right-checkboxes .q-checkbox {
  justify-content: flex-end;
}

.list-group-item {
  display: flex; /* Display items in a row */
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Space between the item text and the close icon */
  padding: 10px 20px; /* Add some padding inside the items */
  margin: 0; /* Remove any default margin */
  border: 1px solid black; /* Black border around each item */
  border-radius: 5px; /* Rounded corners */
  background-color: #f9f9f9; /* Light background color for the button-like appearance */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
  cursor: pointer; /* Change cursor to pointer to indicate it's clickable */
}

.list-group-item + .list-group-item {
  margin-top: -1px; /* Make items touch each other by overlapping borders */
}

.fa-times.close {
  cursor: pointer; /* Ensure the close icon changes cursor to pointer */
  color: #333; /* Color for the close icon */
  margin-left: 15px; /* Space it a bit from the text */
}

/* Additional hover effect for better user feedback */
.list-group-item:hover {
  background-color: #e9ecef;
}

/* Style for the close icon when hovered to give feedback */
.fa-times.close:hover {
  color: #d9534f; /* Change color on hover */
}
</style>
