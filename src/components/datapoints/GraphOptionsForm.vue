<template>
  <q-form class="chart-form" @submit="emit('onSubmit')">
    <q-input v-model.number="refreshInterval" type="number" :label="t('global.automatic_refresh_interval')" />
    <q-input v-model.number="cadence" type="number" :label="t('chart.maximum_values')" />
    <q-select
      v-model="selectedStatisticalMethod"
      :options="statisticalMethods"
      :label="t('chart.statistical_method')"
      map-options
      emit-value
    ></q-select>
    <q-select
      v-model="selectedCurve"
      :options="curveOptions"
      :label="t('chart.curve_type')"
      map-options
      emit-value
    ></q-select>
    <q-select
      v-model="selectedGraphOption"
      :options="graphTypeOptions"
      :label="t('chart.graph_type')"
      map-options
      emit-value
    ></q-select>
  </q-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const statisticalMethods = [
  { value: 1, label: t('chart.statistical_methods.mean') },
  { value: 2, label: t('chart.statistical_methods.median') },
  { value: 3, label: t('chart.statistical_methods.mode') },
  { value: 4, label: t('chart.statistical_methods.min') },
  { value: 5, label: t('chart.statistical_methods.max') },
  { value: 6, label: t('chart.statistical_methods.standard_deviation') },
  { value: 7, label: t('chart.statistical_methods.variance') },
  { value: 8, label: t('chart.statistical_methods.range') },
  { value: 9, label: t('chart.statistical_methods.sum') },
  { value: 10, label: t('chart.statistical_methods.count') },
  { value: 11, label: t('chart.statistical_methods.geometry_mean') },
  { value: 12, label: t('chart.statistical_methods.harmonic_mean') },
];
const curveOptions = [
  { value: 'straight', label: t('chart.curve_options.straight') },
  { value: 'smooth', label: t('chart.curve_options.smooth') },
  { value: 'monotoneCubic', label: t('chart.curve_options.monotone_cubic') },
  { value: 'stepline', label: t('chart.curve_options.stepline') },
];
const graphTypeOptions = [
  { value: 'lines', label: t('chart.graph_options.lines') },
  { value: 'markers', label: t('chart.graph_options.markers') },
  { value: 'linesmarkers', label: t('chart.graph_options.lines_markers') },
];

const refreshInterval = defineModel<number>('refreshInterval', {
  type: Number,
  required: true,
});

const cadence = defineModel<number>('cadence', {
  type: Number,
  required: true,
});

const selectedStatisticalMethod = defineModel<number>('selectedStatisticalMethod', {
  type: Number,
  required: true,
});

const selectedCurve = defineModel<string>('selectedCurve', {
  type: String,
  required: true,
});

const selectedGraphOption = defineModel<string>('selectedGraphOption', {
  type: String,
  required: true,
});

const emit = defineEmits(['onSubmit']);
</script>

<style scoped>
.chart-form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1rem;
}
</style>
