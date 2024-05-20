<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="q-pa-md">
    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <div class="row justify-center items-center" style="display: flex; flex-direction: column">
        <q-card class="q-pa-lg col" style="min-width: 500px">
          <div class="row">
            <div class="column full-width">
              <q-input
                v-model="scenarioStore.scenarioFrame.name"
                filled
                :readonly="isReadonly"
                :label="t('global.name')"
                lazy-rules
                :rules="[(val: string | any[]) => (val && val.length > 0) || t('global.rules.required')]"
              />

              <div>
                <q-select
                  v-model="devicesFromOptions"
                  filled
                  multiple
                  :readonly="isReadonly"
                  :options="deviceOptions"
                  :label="t('device.label', 2)"
                  class="q-mb-lg"
                  option-value="value"
                  option-label="label"
                />
              </div>
              <div></div>
              <q-select
                v-model="scenarioStore.scenarioFrame.activeAtHour"
                :options="hourOptions"
                multiple
                use-chips
                behavior="menu"
                outlined
                :readonly="isReadonly"
                :label="t('scenario.form.activation_hours')"
                option-value="value"
                option-label="label"
                class="custom-select"
                @remove="removeHour"
              ></q-select>
              <q-btn
                v-if="props.mode !== 'detail'"
                :label="t('scenario.form.choose_all_hours')"
                size="12px"
                @click="selectAllHours"
              ></q-btn>
              <div class="row justify-center">
                <q-card class="q-pa-lg q-mt-lg">
                  <label style="font-weight: bold">{{ t('scenario.form.activation_days') }}</label>
                  <q-option-group
                    v-model="scenarioStore.scenarioFrame.activeAtDay"
                    :options="dayOptions"
                    type="checkbox"
                    :disable="props.mode === 'detail'"
                  />
                  <q-btn
                    v-if="props.mode !== 'detail'"
                    :label="t('scenario.form.choose_all_days')"
                    class="q-mt-md"
                    @click="selectAllDays"
                  ></q-btn>
                </q-card>
                <q-card class="q-mt-lg q-ml-md">
                  <q-input
                    v-if="props.mode === 'detail' || props.mode === 'edit'"
                    filled
                    type="textarea"
                    :readonly="isReadonly"
                    :label="t('scenario.json_conditions')"
                    style="resize: none; width: 520px; font-size: 18px"
                    rows="20"
                  />
                </q-card>
              </div>
              <div class="row justify-center">
                <!-- This button will only show when 'showConditions' is false -->
                <q-btn
                  v-if="!showConditions && props.mode !== 'detail'"
                  :label="t('scenario.form.add_conditions')"
                  padding="xl"
                  color="green"
                  size="14px"
                  :icon="mdiPlusCircleOutline"
                  :icon-right="mdiCallSplit"
                  class="q-mt-md"
                  @click="showConditions = true"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div v-if="showConditions" class="q-mt-lg">
        <q-card class="full-width">
          <div class="text-weight-medium q-pa-lg row justify-center" style="font-weight: 600; font-size: 30px">
            {{ t('scenario.conditions_label') }}
          </div>

          <div class="row justify-center q-mx-xl" style="min-height: 300px; overflow-y: auto">
            <q-card class="full-width" style="z-index: 1">
              <div class="row justify-center">
                <q-btn-toggle
                  v-model="selectedOption"
                  push
                  glossy
                  spread
                  toggle-color="secondary"
                  :options="translatedOptions"
                  style="width: 800px"
                  @click="handleToggleClick"
                />
              </div>
              <condition-builder
                :show-programmer-mode="showProgrammerMode"
                :show-pseudocode="showPseudocode"
                @update-json-value="(value) => handleUpdateJsonValue(value)"
                @update-pseudocode-value="(value) => handleUpdatePseudocodeValue(value)"
              ></condition-builder>
              <q-input
                v-if="showPseudocode"
                v-model="scenarioStore.scenarioPseudocode"
                filled
                :label="t('scenario.insert_pseudocode')"
                type="textarea"
                :hint="t('scenario.hint_pseudocode')"
                rows="20"
                style="font-family: monospace; font-size: 20px"
              />
              <q-input
                v-if="showProgrammerMode"
                v-model="scenarioStore.scenarioFrame.rules"
                filled
                :label="t('scenario.json_pseudocode')"
                type="textarea"
                :hint="t('scenario.hint_pseudocode')"
                rows="20"
                style="font-family: monospace; font-size: 20px"
              />
            </q-card>
          </div>
          <div class="row justify-center q-pb-lg">
            <q-btn
              :label="t('scenario.form.remove_conditions')"
              padding="xl"
              color="red"
              size="16px"
              :icon="mdiMinusCircleOutline"
              :icon-right="mdiCallSplit"
              @click="
                clearConditions();
                showConditions = false;
              "
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
          :label="t('global.clean')"
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
import { computed, ref, watch, defineProps, toRefs, PropType, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import CommandService from '@/services/CommandService';
import DeviceService from '@/services/DeviceService';
import { useRoute } from 'vue-router';
import {
  mdiCallSplit,
  mdiPlusCircleOutline,
  mdiMinusCircleOutline,
  mdiTranslate,
  mdiCodeJson,
} from '@quasar/extras/mdi-v6';
import ConditionBuilder from '@/components/scenarios/ConditionBuilder.vue';

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
      alreadyTriggered: false,
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
  scenarioStore.scenarioFrame.alreadyTriggered = data.alreadyTriggered || false;
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

const showAddConditionsButton = computed(() => {
  return scenarioStore.mode === 'create';
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
  { label: '0:00-0:59', value: 0 },
  { label: '1:00-1:59', value: 1 },
  { label: '2:00-2:59', value: 2 },
  { label: '3:00-3:59', value: 3 },
  { label: '4:00-4:59', value: 4 },
  { label: '5:00-5:59', value: 5 },
  { label: '6:00-6:59', value: 6 },
  { label: '7:00-7:59', value: 7 },
  { label: '8:00-8:59', value: 8 },
  { label: '9:00-9:59', value: 9 },
  { label: '10:00-10:59', value: 10 },
  { label: '11:00-11:59', value: 11 },
  { label: '12:00-12:59', value: 12 },
  { label: '13:00-13:59', value: 13 },
  { label: '14:00-14:59', value: 14 },
  { label: '15:00-15:59', value: 15 },
  { label: '16:00-16:59', value: 16 },
  { label: '17:00-17:59', value: 17 },
  { label: '18:00-18:59', value: 18 },
  { label: '19:00-19:59', value: 19 },
  { label: '20:00-20:59', value: 20 },
  { label: '21:00-21:59', value: 21 },
  { label: '22:00-22:59', value: 22 },
  { label: '23:00-23:59', value: 23 },
];
const removeHour = (val: number) => {
  const index = scenarioStore.scenarioFrame.activeAtHour?.indexOf(val);
  if (index > -1) {
    scenarioStore.scenarioFrame.activeAtHour?.splice(index, 1);
  }
};

// Methods to select all options
const selectAllHours = () => {
  scenarioStore.scenarioFrame.activeAtHour = [
    { label: '0:00-0:59', value: 0 },
    { label: '1:00-1:59', value: 1 },
    { label: '2:00-2:59', value: 2 },
    { label: '3:00-3:59', value: 3 },
    { label: '4:00-4:59', value: 4 },
    { label: '5:00-5:59', value: 5 },
    { label: '6:00-6:59', value: 6 },
    { label: '7:00-7:59', value: 7 },
    { label: '8:00-8:59', value: 8 },
    { label: '9:00-9:59', value: 9 },
    { label: '10:00-10:59', value: 10 },
    { label: '11:00-11:59', value: 11 },
    { label: '12:00-12:59', value: 12 },
    { label: '13:00-13:59', value: 13 },
    { label: '14:00-14:59', value: 14 },
    { label: '15:00-15:59', value: 15 },
    { label: '16:00-16:59', value: 16 },
    { label: '17:00-17:59', value: 17 },
    { label: '18:00-18:59', value: 18 },
    { label: '19:00-19:59', value: 19 },
    { label: '20:00-20:59', value: 20 },
    { label: '21:00-21:59', value: 21 },
    { label: '22:00-22:59', value: 22 },
    { label: '23:00-23:59', value: 23 },
  ];
};

const selectAllDays = () => {
  scenarioStore.scenarioFrame.activeAtDay = [1, 2, 3, 4, 5, 6, 7];
};

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
  console.log(arrayOfObjects);
  return arrayOfObjects.map((item) => item.value.uid);
}
const editedScenario = ref<Scenario>();
const route = useRoute();
if (scenarioStore.mode == 'edit') getScenario();

async function onSubmit() {
  if (showConditions.value) {
    //scenarioStore.scenarioFrame.rules = parseRules();
  }
  if (scenarioStore.mode == 'create') {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    scenarioStore.createScenario();
  } else {
    scenarioStore.scenarioFrame.devices = extractIDFromArray(devicesFromOptions.value);
    setEditedScenario();

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
  scenarioStore.scenarioFrame.alreadyTriggered = false;
  scenarioStore.scenarioFrame.mutedUntil = 0;
  scenarioStore.scenarioFrame.activeAtDay = [];
  scenarioStore.scenarioFrame.activeAtHour = [];
}

function clearConditions() {
  selectVariable1.value = null;
  selectOperand1.value = null;
  selectVariable2.value = null;
  jobThen.value = null;
  notificationThen.value = '';
  notificationElse.value = '';
  jobElse.value = null;
  inputValue1.value = '';
  inputValue2.value = '';

  conditionSlot1.value = 'const';
  conditionSlot2.value = 'const';
  thenSlot.value = 'noAction';
  elseSlot.value = 'noAction';
}

function setEditedScenario() {
  if (editedScenario.value) {
    editedScenario.value.rules = scenarioStore.scenarioFrame.rules || ' ';
    editedScenario.value.name = scenarioStore.scenarioFrame.name || '';
    editedScenario.value.devices = scenarioStore.scenarioFrame.devices;
    editedScenario.value.deactivated = scenarioStore.scenarioFrame.deactivated || false;
    editedScenario.value.alreadyTriggered = scenarioStore.scenarioFrame.alreadyTriggered || false;
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
interface Operand {
  label: string;
  value: string;
}
interface Job {
  label: string;
  value: string;
}
interface Variable {
  label: string;
  value: string;
}
const showProgrammerMode = ref(false);
const showPseudocode = ref(false);
const selectedOption = ref('graphical');
const translatedOptions = computed(() => [
  { value: 'graphical', label: t('scenario.rules_type_options.option1') },
  { value: 'pseudocode', label: t('scenario.rules_type_options.option2') },
  { value: 'programmer', label: t('scenario.rules_type_options.option3') },
]);

const selectVariable1 = ref<Variable | null>(null);
const selectOperand1 = ref<Operand | null>(null);
const selectVariable2 = ref<Variable | null>(null);
const jobThen = ref<Job | null>(null);
const notificationThen = ref('');
const notificationElse = ref('');
const jobElse = ref<Job | null>(null);

const pseudocode = ref('');

const showConditions = ref(false);
const inputValue1 = ref('');
const inputValue2 = ref('');

const conditionSlot1 = ref('const');
const conditionSlot2 = ref('const');

const thenSlot = ref('noAction');
const elseSlot = ref('noAction');

async function handleToggleClick() {
  if (selectedOption.value == 'graphical') {
    showProgrammerMode.value = false;
    showPseudocode.value = false;
  } else if (selectedOption.value == 'pseudocode') {
    showPseudocode.value = true;
    showProgrammerMode.value = false;
  } else {
    showPseudocode.value = false;
    showProgrammerMode.value = true;
  }
}
const handleUpdateJsonValue = (value: string) => {
  scenarioStore.scenarioFrame.rules = value;
};

const handleUpdatePseudocodeValue = (value: string) => {
  scenarioStore.scenarioPseudocode = value;
};
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

::v-deep .q-field__native {
  resize: none;
}
</style>
