<template>
  <div id="chart">
    <div class="row items-center justify-start q-mb-md q-gutter-x-md">
      <p class="text-weight-medium text-h6">{{ t('chart.label') }}</p>
      <q-space></q-space>
      <chart-time-range-select ref="timeRangeSelect" @update:model-value="updateTimeRange"></chart-time-range-select>
      <q-btn
        padding="0.5rem 1rem"
        outline
        no-caps
        color="grey-7"
        text-color="grey-5"
        class="options-btn"
        :icon="mdiRefresh"
        @click="refreshStoredData()"
      >
        <template #default>
          <div class="text-grey-10 text-weight-regular q-ml-sm">
            {{ t('global.refresh') }}
          </div>
        </template>
      </q-btn>
      <q-btn
        padding="0.5rem 1rem"
        outline
        no-caps
        color="grey-7"
        text-color="grey-5"
        class="options-btn"
        @click="optionsDialogOpen = true"
      >
        <template #default>
          <div class="text-grey-10 text-weight-regular">
            {{ t('global.options') }}
          </div>
        </template>
      </q-btn>
    </div>
    <apexchart
      ref="chart"
      height="350"
      width="100%"
      type="line"
      :options="chartOptions"
      :series="series"
      @mounted="setChartUpdate"
      @legend-click="legendClick"
    ></apexchart>
    <dialog-common
      v-model="optionsDialogOpen"
      :action-label="t('global.refresh')"
      @on-submit="
        refreshStoredData();
        optionsDialogOpen = false;
      "
    >
      <template #title>{{ t('global.options') }}</template>
      <template #default>
        <GraphOptionsForm
          v-model:cadence="cadence"
          v-model:selectedStatisticalMethod="selectedStatisticalMethod"
          v-model:selectedCurve="selectedCurve"
          v-model:selectedGraphOption="selectedGraphOption"
        />
      </template>
    </dialog-common>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, nextTick, ref, watch } from 'vue';
import ChartTimeRangeSelect from '@/components/datapoints/ChartTimeRangeSelect.vue';
import { TimeRange } from '@/models/TimeRange';
import { graphColors } from '@/utils/colors';
import { DataPointTag } from '@/models/DataPointTag';
import { now, useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import DataPointTagService from '@/services/DataPointTagService';
import DialogCommon from '../core/DialogCommon.vue';
import { mdiRefresh } from '@quasar/extras/mdi-v6';
import GraphOptionsForm from './GraphOptionsForm.vue';

const props = defineProps({
  dataPointTags: {
    type: Array as PropType<DataPointTag[]>,
    required: true,
  },
});
const localDataPointTags = ref<DataPointTag[]>(props.dataPointTags);

const { t } = useI18n();

const selectedTimeRange = ref<TimeRange>();
const timeRangeSelect = ref();
function refreshTimeRange() {
  timeRangeSelect.value?.emitUpdate();
}

const series = computed(() => {
  return localDataPointTags.value.map((tag, index) => ({
    name: `${tag.name} (${tag.unit})`,
    data: tag.storedData.map((data) => ({
      x: data.measureAt ?? 1,
      y: Number(data.value) ?? 0,
      unit: tag.unit,
    })),
    color: graphColors[index],
  }));
});

const chart = ref<ApexCharts | null>(null);
async function updateTimeRange(timeRange: TimeRange) {
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
  refreshStoredData();
}

async function refreshStoredData() {
  if (props.dataPointTags.length === 0) return;
  const from = new Date(selectedTimeRange.value?.from ?? 0);
  const to = new Date(selectedTimeRange.value?.to ?? Date.now());

  const fromUnix = from.getTime();
  const toUnix = to.getTime();

  const promises = props.dataPointTags.map((tag) => {
    return DataPointTagService.getStoredDataByTime(
      tag.uid,
      fromUnix,
      toUnix,
      cadence.value,
      selectedStatisticalMethod.value,
    );
  });

  const results = await Promise.all(promises);

  localDataPointTags.value = props.dataPointTags.map((tag, index) => ({
    ...tag,
    storedData: results[index],
  }));
  await updateSeriesVisibility(localDataPointTags.value, tickedNodes.value ?? []);
}

//Legend control
const tickedNodes = defineModel<string[]>('tickedNodes');
const seriesVisibility = ref<boolean[]>(props.dataPointTags.map(() => true));
const chartCnt = ref();
const chartUpdate = ref();
function setChartUpdate(chartContext: { update: unknown }) {
  chartCnt.value = chartContext;
  chartUpdate.value = chartContext.update;
}

function enableChartUpdate() {
  if (!chartCnt.value) return;
  chartCnt.value.update = chartUpdate.value;
  chartCnt.value.update();
}

function disableChartUpdate() {
  if (!chartCnt.value) return;
  chartCnt.value.update = () => {
    return Promise.resolve();
  };
}

function legendClick(_chartContext: unknown, seriesIndex: number) {
  seriesVisibility.value[seriesIndex] = !seriesVisibility.value[seriesIndex];
  tickedNodes.value = props.dataPointTags.filter((_, index) => seriesVisibility.value[index]).map((tag) => tag.uid);
}

function areAllSeriesVisible(newTicked: string[]) {
  if (!tickedNodes.value) return false;
  const previousAllVisible = props.dataPointTags.every((tag) => tickedNodes.value?.includes(tag.uid));
  const newAllVisible = props.dataPointTags.every((tag) => newTicked?.includes(tag.uid));
  const seriesVisibilityAll = seriesVisibility.value.every((visible) => visible);

  return previousAllVisible && newAllVisible && seriesVisibilityAll;
}

async function updateSeriesVisibility(tags: DataPointTag[], ticked: string[]) {
  if (!chartCnt.value) return;

  // For performance, we check if all series are visible and if so, we don't update the chart
  if (areAllSeriesVisible(ticked)) return;

  await nextTick();
  disableChartUpdate();

  if (chart.value) {
    tags.forEach((tag) => {
      const seriesName = `${tag.name} (${tag.unit})`;
      if (ticked.includes(tag.uid)) {
        chart.value?.showSeries(seriesName);
        seriesVisibility.value[tags.indexOf(tag)] = true;
      } else {
        chart.value?.hideSeries(seriesName);
        seriesVisibility.value[tags.indexOf(tag)] = false;
      }
    });
  }
  enableChartUpdate();
}

const optionsDialogOpen = ref(false);

const cadence = useStorage('graphOptions.cadence', 1000);
const selectedStatisticalMethod = useStorage('graphOptions.selectedStatisticalMethod', 1);
const selectedCurve = useStorage('graphOptions.selectedCurve', 'straight');
const selectedGraphOption = useStorage('graphOptions.selectedGraphOption', 'lines');

const markerSize = computed(() => {
  if (selectedGraphOption.value === 'markers' || selectedGraphOption.value === 'linesmarkers') {
    return 5;
  }
  return 0;
});

const strokeWidth = computed(() => {
  if (selectedGraphOption.value === 'lines' || selectedGraphOption.value === 'linesmarkers') {
    return 5;
  }

  return 0;
});

watch(
  () => tickedNodes.value,
  async (newTicked) => {
    updateSeriesVisibility(localDataPointTags.value, newTicked ?? []);
  },
);

watch(
  () => props.dataPointTags,
  async () => {
    await refreshStoredData();
  },
);

defineExpose({
  refreshTimeRange,
});

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
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
    animations: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: selectedCurve.value,
    width: strokeWidth.value,
  },
  markers: {
    size: markerSize.value,
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  yaxis: localDataPointTags.value.map((tag, index) => ({
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      formatter: function (val: number) {
        return `${val?.toFixed(tag.decimal) ?? 'NaN'} ${tag.unit}`;
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
    min: new Date(selectedTimeRange.value?.from ?? now()).getTime(),
    max: new Date(selectedTimeRange.value?.to ?? now()).getTime(),
  },
  tooltip: {
    shared: false,
    y: localDataPointTags.value.map((tag) => ({
      formatter: function (val: number) {
        return `${val?.toFixed(tag.decimal) ?? 'NaN'} ${tag.unit}`;
      },
    })),
    x: {
      formatter: function (val: number) {
        return new Date(val).toLocaleString();
      },
    },
  },
}));
</script>

<style lang="scss">
.options-btn {
  .q-icon {
    color: #757575 !important;
  }
}
</style>
