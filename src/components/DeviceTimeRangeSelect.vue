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
    <template v-slot:prepend>
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
            @update:model-value="setCustomTimeRange"
            range
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
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
import { computed, ref, watch } from 'vue';
import { PredefinedTimeRange } from '../models/TimeRange';

const emit = defineEmits(['update:modelValue']);
defineExpose({
  refreshComputedTimeRange,
});

const timeRanges = <PredefinedTimeRange[]>[
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
];
const selectedTimeRange = ref(timeRanges[1]);
const customTimeRangeSelected = ref({
  from: new Date(),
  to: new Date(),
});
const isCustomTimeRangeSelected = ref(false);
const refreshKey = ref(0);

function setCustomTimeRange(val: { from: Date; to: Date }) {
  customTimeRangeSelected.value = val;
  isCustomTimeRangeSelected.value = true;
}

function setPredefinedTimeRange(val: PredefinedTimeRange) {
  selectedTimeRange.value = val;
  isCustomTimeRangeSelected.value = false;
}

function refreshComputedTimeRange() {
  refreshKey.value++;
}

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');
const timeRangeComputed = computed(() => {
  refreshKey.value;
  if (isCustomTimeRangeSelected.value) {
    return {
      from: formatDate(new Date(customTimeRangeSelected.value.from)),
      to: formatDate(new Date(customTimeRangeSelected.value.to)),
    };
  } else {
    const now = new Date();
    return {
      from: formatDate(subSeconds(now, selectedTimeRange.value.time)),
      to: formatDate(now),
    };
  }
});

watch(
  () => timeRangeComputed.value,
  (newVal) => {
    emit('update:modelValue', newVal);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.date-picker {
  min-width: 190px;
}
</style>
