<template>
  <div id="chart">
    <div class="row items-center justify-start q-mb-md q-gutter-x-md">
      <p class="text-weight-medium text-h6">Chart</p>
      <q-space></q-space>
      <device-time-range-select
        @update:timeRange="updateTimeRange"
      ></device-time-range-select>
      <q-btn
        text-color="primary"
        outline
        unelevated
        no-caps
        label="Refresh"
        padding="0.5rem 1rem"
        icon-right="mdi-refresh"
        @click="store.refreshDevice()"
        :loading="store.isRefreshingDevice"
      ></q-btn>
    </div>
    <apexchart
      height="350"
      width="100%"
      type="area"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useDevicesStore } from '../stores/devices-store';
import DeviceTimeRangeSelect from 'src/components/DeviceTimeRangeSelect.vue';

const store = useDevicesStore();

const series = computed(() => {
  return store.device?.dataPointTags.map((tag) => ({
    name: tag.name,
    data: tag.storedData.map((data) => ({
      x: data.measureAdd,
      y: data.value,
      unit: tag.unit,
    })),
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
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100],
    },
  },
  yaxis: yaxisLabels.map((unit) => ({
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
    },
  })),
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
    },
    min: new Date(store.timeRangeComputed.from).getTime(),
    max: new Date(store.timeRangeComputed.to).getTime(),
  },
  tooltip: {
    shared: true,
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
function updateTimeRange(timeRange: { from: string; to: string }) {
  if (chart.value) {
    chart.value.updateOptions({
      xaxis: {
        min: new Date(timeRange.from).getTime(),
        max: new Date(timeRange.to).getTime(),
      },
    });
  }
}

watch(
  () => store.timeRangeComputed,
  (val) => {
    nextTick(() => {
      updateTimeRange(val);
    });
  }
);
</script>

<style lang="scss" scoped></style>
