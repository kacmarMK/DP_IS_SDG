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
        @click="onClickRefresh"
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
      @before-reset-zoom="beforeResetZoom"
      @zoomed="onChartZoomed"
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
          v-model:refreshInterval="refreshInterval"
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
import { useInterval } from '@/composables/useInterval';

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

const series = computed(() => {
  return localDataPointTags.value.map((tag, index) => ({
    name: `${tag.name} (${tag.unit})`,
    unit: tag.unit,
    decimal: tag.decimal,
    id: tag.uid,
    data: tag.storedData.map((data) => ({
      x: data.measureAt ?? 1,
      y: Number(data.value) ?? 0,
    })),
    color: graphColors[index],
  }));
});

const yaxisOptions = computed(() => {
  const nameMap = new Map();
  const shownUnits = new Set();

  const options = series.value.map((tag) => {
    if (!nameMap.has(tag.unit)) {
      nameMap.set(tag.unit, tag.name);
    }

    const isVisible = tickedNodes.value?.includes(tag.id);

    let showAxis = !shownUnits.has(tag.unit) && isVisible;
    if (showAxis) {
      shownUnits.add(tag.unit);
    }

    const alwaysShow =
      shownUnits.has(tag.unit) && series.value.some((t) => t.unit === tag.unit && tickedNodes.value?.includes(t.id));

    return {
      show: showAxis,
      alwaysShow: alwaysShow,
      seriesName: nameMap.get(tag.unit),
      tickAmount: 1,
      axisBorder: {
        show: showAxis,
      },
      axisTicks: {
        show: showAxis,
      },
      labels: {
        formatter: function (val: number) {
          return `${val?.toFixed(tag.decimal) ?? 'NaN'} ${tag.unit}`;
        },
        style: {
          colors: tag.color,
        },
      },
    };
  });

  return options;
});

const chart = ref<ApexCharts | null>(null);
async function updateTimeRange(timeRange: TimeRange) {
  lastZoom.value = null;
  selectedTimeRange.value = timeRange;
  const newMin = new Date(timeRange.from).getTime();
  const newMax = new Date(timeRange.to).getTime();

  if (chart.value) {
    chart.value.updateOptions({
      xaxis: {
        min: newMin,
        max: newMax,
      },
    });
  } else {
    chartOptions.value.xaxis.min = newMin;
    chartOptions.value.xaxis.max = newMax;
  }
  await refreshStoredData();
}

async function onClickRefresh() {
  if (!lastZoom.value) {
    timeRangeSelect.value?.emitUpdate();
  } else if (lastZoom.value && lastZoom.value[1] == chartOptions.value.xaxis.max) {
    lastZoom.value = null;
    timeRangeSelect.value?.emitUpdate();
  } else {
    await refreshStoredData();
  }
}

async function refreshStoredData() {
  if (props.dataPointTags.length === 0) return;
  const from = new Date(selectedTimeRange.value?.from ?? 0);

  const zoomTo = lastZoom.value?.[1] ?? Date.now();
  const selectedTimeRangeTo = new Date(selectedTimeRange.value?.to ?? Date.now());

  const to = new Date(zoomTo > selectedTimeRangeTo.getTime() ? zoomTo : selectedTimeRangeTo.getTime());

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

  disableChartUpdate();
  localDataPointTags.value = props.dataPointTags.map((tag, index) => ({
    ...tag,
    storedData: results[index],
  }));
  enableChartUpdate();

  await updateSeriesVisibility(localDataPointTags.value, tickedNodes.value ?? []);

  // Zoom back after data refresh
  if (chart.value && lastZoom.value) {
    chart.value?.zoomX(lastZoom.value[0], lastZoom.value[1]);
  }
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

// Zoom for chart update, to keep the zoom after data refresh
const lastZoom = ref<[number, number] | null>();
function beforeResetZoom() {
  lastZoom.value = null;
}
function onChartZoomed(chartContext: unknown, { xaxis }: { xaxis: { min: number; max: number } }) {
  lastZoom.value = [xaxis.min, xaxis.max];
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

const refreshInterval = useStorage('graphOptions.refreshInterval', 60);
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

const intervalMilliseconds = computed(() => refreshInterval.value * 1000);
useInterval(() => {
  onClickRefresh();
}, intervalMilliseconds);

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
  yaxis: yaxisOptions.value,
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
