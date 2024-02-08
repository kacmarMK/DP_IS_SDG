<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-form class="q-gutter-md" @submit.prevent="onSubmit" @reset="onReset">
      <q-card class="q-pa-lg">
        <q-input
          v-model="scenarioStore.scenarioFrame.name"
          filled
          :label="t('global.name')"
          lazy-rules
          :rules="[(val: string | any[]) => (val && val.length > 0) || t('global.rules.required')]"
        />

        <div class="q-pb-md" style="max-width: 600px">
          <q-select
            v-model="devicesFromOptions"
            filled
            multiple
            :options="deviceOptions"
            :label="t('device.label', 2)"
          />
        </div>

        <q-input
          v-model.number="scenarioStore.scenarioFrame.mutedUntil"
          type="number"
          filled
          :label="t('scenario.form.muted_until')"
          style="max-width: 200px"
        />
      </q-card>
      <q-card class="q-pa-lg">
        <div>
          <q-checkbox
            v-model="scenarioStore.scenarioFrame.deactivated"
            left-label
            :label="t('scenario.form.scenario_active')"
          />
        </div>
        <div>
          <q-checkbox
            v-model="scenarioStore.scenarioFrame.isAlreadyTriggered"
            left-label
            :label="t('scenario.form.scenario_triggered')"
          />
        </div>
      </q-card>
      <q-card class="q-pa-lg">
        <div>
          <q-option-group
            v-model="scenarioStore.scenarioFrame.activeAtDay"
            :options="dayOptions"
            type="checkbox"
            left-label
          />
        </div>
      </q-card>
      <q-card class="q-pa-lg">
        <div>
          <q-option-group
            v-model="scenarioStore.scenarioFrame.activeAtHour"
            size="xs"
            :options="hourOptions"
            type="checkbox"
            left-label
            inline
            dense
          />
        </div>
      </q-card>
      <div>
        <q-btn :label="t('global.create')" type="submit" color="primary" />
        <q-btn :label="t('global.refresh')" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ScenarioFrame } from '@/models/Scenario';
import { useDeviceStore } from '@/stores/device-store';
import { useScenarioStore } from '@/stores/scenario-store';
import { Device } from '@/models/Device';

const { t } = useI18n();
const deviceStore = useDeviceStore();
const scenarioStore = useScenarioStore();
deviceStore.devices.refresh();

const deviceOptions = getDeviceOptions();

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

const devicesFromOptions = ref([]);

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
  //TODO
}
</script>

<style lang="scss" scoped></style>
