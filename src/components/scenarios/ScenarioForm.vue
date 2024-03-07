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
          v-if="!showConditions && showAddConditionsButton"
          label="Add conditions"
          padding="xl"
          color="green"
          size="16px"
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
                style="
                  background-color: #f5f5f5;
                  padding: 70px;
                  border-radius: 8px;
                  font-family: monospace;
                  white-space: pre;
                  overflow-x: auto;
                  border: 1px solid #ddd;
                  font-size: 17px;
                "
              >
                <span class="q-pa-sm" style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >if</span
                >
                <div class="row q-gutter-sm q-mx-md q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
                  <div class="col-1 q-mt-md q-pt-sm" style="font-size: 40px">(</div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-radio
                        v-model="conditionSlot1"
                        name="conditionSlot1"
                        val="const"
                        left-label
                        label="Constant"
                        color="secondary"
                      />
                      <q-radio v-model="conditionSlot1" name="conditionSlot1" val="val" label="Value" />
                    </div>

                    <q-input
                      v-if="conditionSlot1 == 'const'"
                      v-model="inputValue1"
                      label="Enter Constant"
                      dense
                      :rules="[requiredInputRule]"
                    ></q-input>
                    <q-select
                      v-if="conditionSlot1 == 'val'"
                      v-model="selectVariable1"
                      :options="conditonVariable1"
                      label="Choose Value"
                      dense
                      :rules="[requiredSelectRule]"
                    ></q-select>
                  </div>
                  <div class="col-2 q-mt-xl">
                    <q-select
                      v-model="selectOperand"
                      :options="operands"
                      label="Operand"
                      dense
                      :rules="[requiredSelectRule]"
                    ></q-select>
                  </div>
                  <div class="col">
                    <div class="row justify-center">
                      <q-radio
                        v-model="conditionSlot2"
                        name="conditionSlot2"
                        val="const"
                        left-label
                        label="Constant"
                        color="secondary"
                      />
                      <q-radio v-model="conditionSlot2" name="conditionSlot2" val="val" label="Value" />
                    </div>

                    <q-input
                      v-if="conditionSlot2 == 'const'"
                      v-model="inputValue2"
                      label="Enter Constant"
                      dense
                      :rules="[requiredInputRule]"
                    ></q-input>
                    <q-select
                      v-if="conditionSlot2 == 'val'"
                      v-model="selectVariable2"
                      :options="conditonVariable2"
                      label="Choose Value"
                      dense
                      :rules="[requiredSelectRule]"
                    ></q-select>
                  </div>
                  <!--
                  <div class="col-1 q-pa-lg q-mt-md q-ml-xl">
                    <q-btn size="15px" label="+" color="primary" style="font-size: 12px"></q-btn>
                  </div>
                  -->
                  <div class="col-1 q-pl-xl q-pt-xs q-mt-lg" style="font-size: 40px">)</div>
                  <div class="col-1 q-pa-md q-pt-lg q-mt-lg">
                    <q-btn size="14px" label="+" round dense color="secondary"></q-btn>
                  </div>
                </div>
                <div class="row q-pa-md">
                  <q-btn size="17px" label="+" round dense color="secondary"></q-btn>
                </div>
                <span
                  class="q-pa-sm q-ma-sm"
                  style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >then</span
                >
                {
                <br />
                <div class="q-pa-md" style="border-radius: 8px; border: 1px solid #858585">
                  <div class="row justify-center">
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="noAction"
                      label="No Action"
                      color="red"
                    />
                    <q-radio v-model="thenSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="notification"
                      label="Notification"
                      color="orange"
                    />
                    <q-radio
                      v-model="thenSlot"
                      class="q-mr-lg"
                      keep-color
                      val="condition"
                      label="Condition"
                      color="blue"
                    />
                  </div>
                  <div class="row justify-center">
                    <div class="col-5">
                      <q-input
                        v-if="thenSlot == 'notification'"
                        v-model="notificationThen"
                        label="Enter Notification Message"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="thenSlot === 'job'"
                        v-model="jobThen"
                        :options="jobOptions"
                        label="Jobs"
                        dense
                        class="col"
                        :rules="[requiredInputRule]"
                      ></q-select>
                    </div>
                  </div>
                </div>

                <br />
                }
                <span
                  class="q-pa-sm q-mt-sm"
                  style="background-color: #e0e0e0; border-radius: 6px; display: inline-block"
                  >else</span
                >
                {
                <br />
                <div class="q-pa-md q-mt-sm" style="border-radius: 8px; border: 1px solid #858585">
                  <div class="row justify-center">
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="noAction"
                      label="No Action"
                      color="red"
                    />
                    <q-radio v-model="elseSlot" class="q-mr-lg" keep-color val="job" label="Job" color="teal" />
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="notification"
                      label="Notification"
                      color="orange"
                    />
                    <q-radio
                      v-model="elseSlot"
                      class="q-mr-lg"
                      keep-color
                      val="condition"
                      label="Condition"
                      color="blue"
                    />
                  </div>
                  <div class="row justify-center">
                    <div class="col-5">
                      <q-input
                        v-if="elseSlot == 'notification'"
                        v-model="notificationElse"
                        label="Enter Notification Message"
                        dense
                        :rules="[requiredInputRule]"
                      ></q-input>
                      <q-select
                        v-if="elseSlot === 'job'"
                        v-model="jobElse"
                        :options="jobOptions"
                        label="Jobs"
                        dense
                        class="col"
                        :rules="[requiredInputRule]"
                      ></q-select>
                    </div>
                  </div>
                </div>
                <br />}
              </div>
            </q-card>
          </div>
          <div class="row justify-center q-pb-lg">
            <q-btn
              label="Remove conditions"
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
import { computed, ref, watch, defineProps, toRefs, PropType, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';
import RecipeService from '@/services/RecipeService';
import DeviceService from '@/services/DeviceService';
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

const showAddConditionsButton = computed(() => {
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
  if (showConditions.value) {
    scenarioStore.scenarioFrame.rules = parseRules();
    console.log(scenarioStore.scenarioFrame.rules);
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
  scenarioStore.scenarioFrame.isAlreadyTriggered = false;
  scenarioStore.scenarioFrame.mutedUntil = 0;
  scenarioStore.scenarioFrame.activeAtDay = [];
  scenarioStore.scenarioFrame.activeAtHour = [];
}

function clearConditions() {
  selectVariable1.value = null;
  selectOperand.value = null;
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
    editedScenario.value.isAlreadyTriggered = scenarioStore.scenarioFrame.isAlreadyTriggered || false;
    editedScenario.value.mutedUntil = scenarioStore.scenarioFrame.mutedUntil || 0;
    editedScenario.value.activeAtDay = scenarioStore.scenarioFrame.activeAtDay || [];
    editedScenario.value.activeAtHour = scenarioStore.scenarioFrame.activeAtHour || [];
  }
}

function parseRules() {
  const rulesStringStart = '{"if": [';
  let conditionString = '';
  let thenString = '';
  let elseString = '';
  const rulesStringEnd = ']}';

  // Condition string creation
  if (inputValue1.value && inputValue2.value) {
    // Both condition slots are constants
    conditionString =
      '{ "' + selectOperand.value?.value + '": [ ' + inputValue1.value + ', ' + inputValue2.value + ' ] },';
  } else if (inputValue1.value && selectVariable2.value) {
    // Condition slot 1 is a constant, Condition slot 2 is a variable
    //TODO
  } else if (selectVariable1.value && inputValue2.value) {
    // Condition slot 1 is a variable, Condition slot 2 is a constant
    //TODO
  } else {
    // Both condition slots are variables
    // TODO
  }

  // Then string creation
  if (thenSlot.value === 'noAction') {
    thenString = ' "noAction",';
  } else if (thenSlot.value === 'job') {
    thenString = ' "job:' + jobThen.value?.value + '",';
  } else {
    thenString = ' "notificationMessage:' + notificationThen.value + '",';
  }

  // Else string creation
  if (elseSlot.value === 'noAction') {
    elseString = ' "noAction" ';
  } else if (elseSlot.value === 'job') {
    elseString = ' "job:' + jobElse.value?.value + '"';
  } else {
    elseString = ' "notificationMessage:' + notificationElse.value + '"';
  }

  return rulesStringStart + conditionString + thenString + elseString + rulesStringEnd;
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
const selectVariable1 = ref<Variable | null>(null);
const selectOperand = ref<Operand | null>(null);
const selectVariable2 = ref<Variable | null>(null);
const jobThen = ref<Job | null>(null);
const notificationThen = ref('');
const notificationElse = ref('');
const jobElse = ref<Job | null>(null);
const conditonVariable1 = ref<{ label: string; value: string }[]>([]);
const operands = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
];
const conditonVariable2 = ref<{ label: string; value: string }[]>([]);
const jobOptions = ref<{ label: string; value: string }[]>([]);

const showConditions = ref(false);
const inputValue1 = ref('');
const inputValue2 = ref('');

const conditionSlot1 = ref('const');
const conditionSlot2 = ref('const');
const thenSlot = ref('noAction');
const elseSlot = ref('noAction');

const requiredInputRule = (val: string | number): string | boolean => {
  const number = parseFloat(val as string);
  return (!isNaN(number) && isFinite(number)) || 'This field is required';
};
const requiredSelectRule = (val: string) => !!val || val === '' || 'This field is required';

onMounted(async () => {
  const recipes = await RecipeService.getRecipes('NONE', 'NONE');
  jobOptions.value = recipes.map((recipe) => ({
    label: recipe.name,
    value: recipe.id,
  }));

  const devices = await DeviceService.getDevices();
  conditonVariable1.value = devices.map((device) => ({
    label: device.name,
    value: device.name,
  }));
  conditonVariable2.value = devices.map((device) => ({
    label: device.name,
    value: device.name,
  }));
  // TODO fixnut tagy
  console.log(devices);
});
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
.q-select {
  font-size: 1.25rem;
}
</style>
