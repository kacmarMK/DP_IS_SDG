<template>
  <q-select
    ref="dateSelect"
    class="shadow date-picker"
    v-model="store.timeRangeSelected"
    :options="timeRanges"
    label="Time Range"
    option-value="timeRange"
    option-label="name"
    filled
    dense
    bg-color="white"
    map-options
  >
    <template v-slot:prepend>
      <q-icon name="mdi-clock-outline" />
    </template>
    <template #after-options>
      <q-item clickable>
        <q-item-section>
          <q-item-label>Custom</q-item-label>
        </q-item-section>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="store.timeRangeSelected" range>
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <template v-if="scope.opt.name">
        {{ scope.opt.name }}
      </template>
      <template v-else-if="scope.opt"
        >{{ store.timeRangeSelected.from }} -
        {{ store.timeRangeSelected.to }}</template
      >
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useDevicesStore } from '../stores/devices-store';
import { format, subMinutes, subHours } from 'date-fns';

const store = useDevicesStore();

function getLastHoursRange(hours: number) {
  return {
    from: format(subHours(new Date(), hours), 'yyyy/MM/dd HH:mm:ss'),
    to: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
  };
}

function getLastMinutesRange(minutes: number) {
  return {
    from: format(subMinutes(new Date(), minutes), 'yyyy/MM/dd HH:mm:ss'),
    to: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
  };
}
const timeRanges = [
  {
    name: 'Last 10 Minutes',
    timeRange: getLastMinutesRange(10),
  },
  {
    name: 'Last 1 Hour',
    timeRange: getLastHoursRange(1),
  },
  {
    name: 'Last 6 Hours',
    timeRange: getLastHoursRange(6),
  },
  {
    name: 'Last 12 Hours',
    timeRange: getLastHoursRange(12),
  },
];

//Sets default time range
store.timeRangeSelected = timeRanges[1].timeRange;
</script>

<style lang="scss" scoped>
.date-picker {
  min-width: 190px;
}
</style>
