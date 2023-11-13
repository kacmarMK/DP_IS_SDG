<template>
  <div id="chart">
    <div class="row items-center justify-start q-mb-md q-gutter-x-md">
      <p class="text-weight-medium text-h6">Chart</p>
      <q-space></q-space>
      <device-time-range-select
        @update:model-value="updateTimeRange"
        ref="timeRangeSelect"
      ></device-time-range-select>
      <q-btn
        text-color="primary"
        outline
        unelevated
        no-caps
        label="Refresh"
        padding="0.5rem 1rem"
        icon="mdi-refresh"
        @click="refreshDevice()"
        :loading="store.isRefreshingDevice"
      ></q-btn>
    </div>
    <apexchart
      height="350"
      width="100%"
      type="line"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDevicesStore } from '../stores/devices-store';
import DeviceTimeRangeSelect from 'src/components/DeviceTimeRangeSelect.vue';
import { TimeRange } from '../models/TimeRange';
import { graphColors } from '../utils/colors';

const store = useDevicesStore();

const selectedTimeRange = ref<TimeRange>({
  from: new Date().toISOString(),
  to: new Date().toISOString(),
});

const timeRangeSelect = ref();
function refreshDevice() {
  store.refreshDevice();
  timeRangeSelect.value?.emitUpdate();
}

const series = computed(() => {
  return store.device?.dataPointTags.map((tag, index) => ({
    name: tag.name,
    data: tag.storedData.map((data) => ({
      x: data.measureAdd,
      y: data.value,
      unit: tag.unit,
    })),
    color: graphColors[index],
  }));
});

const yaxisLabels = store.device?.dataPointTags.map((tag) => tag.unit) || [];

const chartOptions = ref({
  chart: {
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
    },
    toolbar: {
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },
  markers: {
    size: 0,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  yaxis: yaxisLabels.map((unit, index) => ({
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0) + unit;
      },
      style: {
        colors: graphColors[index],
      },
    },
  })),
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
    },
    min: new Date(selectedTimeRange.value.from).getTime(),
    max: new Date(selectedTimeRange.value.to).getTime(),
  },
  tooltip: {
    shared: false,
    y: yaxisLabels.map((unit) => ({
      formatter: function (val: number) {
        return val.toFixed(2) + unit;
      },
    })),
    x: {
      formatter: function (val: number) {
        return new Date(val).toLocaleString();
      },
    },
  },
});

const chart = ref<ApexCharts | null>(null);
function updateTimeRange(timeRange: TimeRange) {
  selectedTimeRange.value = timeRange;
  if (chart.value) {
    chart.value.updateOptions({
      xaxis: {
        min: new Date(timeRange.from).getTime(),
        max: new Date(timeRange.to).getTime(),
      },
    });
  } else {
    chartOptions.value.xaxis.min = new Date(timeRange.from).getTime();
    chartOptions.value.xaxis.max = new Date(timeRange.to).getTime();
  }
}
</script>

<style lang="scss" scoped></style>
