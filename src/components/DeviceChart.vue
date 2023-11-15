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
      <q-btn-dropdown
        padding="0.5rem 1rem"
        outline
        no-caps
        color="grey-color"
        label="Options"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="download(csvConfig)(generateCSVData())"
          >
            <q-item-section>
              <q-item-label>Export CSV</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { format } from 'date-fns';

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
      tools: {
        download: false,
      },
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

//CSV export
const csvConfig = mkConfig({ useKeysAsHeaders: true, fieldSeparator: ';' });

const generateCSVData = () => {
  let allData: {
    name: string;
    unit: string;
    measureAdd: number;
    value: number;
  }[] = [];

  // Combine all data points from each tag
  store.device?.dataPointTags.forEach((tag) => {
    tag.storedData.forEach((data) => {
      allData.push({
        name: tag.name,
        unit: tag.unit,
        measureAdd: data.measureAdd,
        value: data.value,
      });
    });
  });

  // Sort the data by measureAdd (timestamp)
  allData.sort(
    (a, b) =>
      new Date(a.measureAdd).getTime() - new Date(b.measureAdd).getTime()
  );

  // Format the data for CSV export
  let csvData = allData.map((data) => ({
    name: data.name,
    unix: new Date(data.measureAdd).getTime(),
    date: format(new Date(data.measureAdd), 'dd/MM/yyyy'),
    time: format(new Date(data.measureAdd), 'HH:mm:ss'),
    value: data.value,
    unit: data.unit,
  }));

  return generateCsv(csvConfig)(csvData);
};
</script>

<style lang="scss" scoped></style>
