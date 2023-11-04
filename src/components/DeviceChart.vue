<template>
  <div id="chart">
    <apexchart
      height="350"
      width="100%"
      type="area"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDevicesStore } from '../stores/devices-store';

const store = useDevicesStore();

const series = computed(() => {
  const seriesData = store.device?.dataPointTags.map((tag) => ({
    name: tag.name,
    data: tag.storedData.map((data) => ({
      x: data.measureAdd,
      y: data.value,
      unit: tag.unit, // Add unit to the data
    })),
  }));
  return seriesData;
});

const yaxisLabels = store.device?.dataPointTags.map((tag) => tag.unit) || [];

const chartOptions = {
  chart: {
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
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
  title: {
    text: 'Chart',
    align: 'left',
    margin: 0,
    offsetX: -10,
    style: {
      fontSize: '17px',
      fontWeight: '500',
      fontFamily: 'Inter',
    },
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
        return val.toFixed(2) + unit;
      },
    },
  })),
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    shared: false,
    y: yaxisLabels.map((unit) => ({
      formatter: function (val: number) {
        return val.toFixed(2) + unit;
      },
    })),
  },
};
</script>

<style lang="scss" scoped></style>
