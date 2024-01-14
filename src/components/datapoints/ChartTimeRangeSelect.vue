<template>
  <q-select
    ref="dateSelect"
    class="date-picker"
    :options="timeRanges"
    label="Time Range"
    option-value="timeRange"
    option-label="title"
    outlined
    dense
    map-options
    :model-value="selectedTimeRange"
    @update:model-value="setPredefinedTimeRange"
  >
    <template #prepend>
      <q-icon name="mdi-clock-outline" />
    </template>
    <template #after-options>
      <q-item clickable>
        <q-item-section>
          <q-item-label>Custom</q-item-label>
        </q-item-section>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date
            :model-value="customTimeRangeSelected"
            range
            @update:model-value="setCustomTimeRange"
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn v-close-popup label="OK" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-item>
    </template>
    <template #selected-item="scope">
      <template v-if="isCustomTimeRangeSelected"
        >{{ customTimeRangeSelected.from }} -
        {{ customTimeRangeSelected.to }}</template
      >
      <template v-else-if="scope.opt.name">
        {{ scope.opt.title }}
      </template>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { format, subSeconds } from 'date-fns';
import { ref } from 'vue';
import { PredefinedTimeRange } from '@/models/TimeRange';

const emit = defineEmits(['update:modelValue']);
defineExpose({
  emitUpdate,
});

const timeRanges: PredefinedTimeRange[] = [
  {
    title: 'Last 10 Minutes',
    name: '10m',
    time: 600,
  },
  {
    title: 'Last 1 Hour',
    name: '1h',
    time: 3600,
  },
  {
    title: 'Last 6 Hours',
    name: '6h',
    time: 21600,
  },
  {
    title: 'Last 12 Hours',
    name: '12h',
    time: 43200,
  },
  {
    title: 'Last 24 Hours',
    name: '24h',
    time: 86400,
  },
  {
    title: 'Last Week',
    name: '1w',
    time: 604800,
  },
  {
    title: 'Last Month',
    name: '1m',
    time: 2592000,
  },
];
const selectedTimeRange = ref(timeRanges[1]);
const customTimeRangeSelected = ref({
  from: new Date(),
  to: new Date(),
});
const isCustomTimeRangeSelected = ref(false);

function setCustomTimeRange(val: { from: Date; to: Date }) {
  customTimeRangeSelected.value = val;
  isCustomTimeRangeSelected.value = true;
  emitUpdate();
}

function setPredefinedTimeRange(val: PredefinedTimeRange) {
  selectedTimeRange.value = val;
  isCustomTimeRangeSelected.value = false;
  emitUpdate();
}

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');
function emitUpdate() {
  let newVal;
  if (isCustomTimeRangeSelected.value) {
    newVal = {
      from: formatDate(new Date(customTimeRangeSelected.value.from)),
      to: formatDate(new Date(customTimeRangeSelected.value.to)),
    };
  } else {
    const now = new Date();
    newVal = {
      from: formatDate(subSeconds(now, selectedTimeRange.value.time)),
      to: formatDate(now),
    };
  }
  emit('update:modelValue', newVal);
}
emitUpdate();
</script>

<style lang="scss" scoped>
.date-picker {
  min-width: 190px;
}
</style>
