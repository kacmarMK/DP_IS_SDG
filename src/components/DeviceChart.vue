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
import { useDevicesStore } from '../stores/devices-store';

const store = useDevicesStore();

const series = [
  {
    name: 'sensor-1',
    data: [
      [1634400000000, 432],
      [1634403600000, 502],
      [1634407200000, 452],
      [1634410800000, 600],
      [1634414400000, 300],
      [1634418000000, 200],
    ],
  },
  {
    name: 'sensor-2',
    data: [
      [1634400000000, 942],
      [1634403600000, 1202],
      [1634407200000, 902],
      [1634410800000, 1500],
      [1634414400000, 900],
      [1634418000000, 800],
    ],
  },
];

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
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toFixed(0);
      },
    },
  },
  xaxis: {
    type: 'datetime',
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val: number) {
        return val.toFixed(0);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
