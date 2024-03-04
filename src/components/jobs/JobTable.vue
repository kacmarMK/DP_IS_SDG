<template>
  <q-table
    :rows="props.jobs"
    :columns="columns"
    :loading="props.loading"
    flat
    :rows-per-page-options="[10, 20, 50]"
    class="shadow"
    :no-data-label="t('table.no_data_label')"
    :loading-label="t('table.loading_label')"
    :rows-per-page-label="t('table.rows_per_page_label')"
  >
    <template #no-data="{ message }">
      <div class="full-width column flex-center q-pa-lg nothing-found-text">
        <q-icon :name="mdiListStatus" class="q-mb-md" size="50px"></q-icon>
        {{ message }}
      </div>
    </template>

    <template #body-cell-status="tableProps">
      <q-td auto-width :props="tableProps">
        <q-badge :color="statusColors[tableProps.row.currentStatus as JobStatusEnum]" class="q-pa-xs">
          {{ tableProps.row.currentStatus }}
        </q-badge>
      </q-td>
    </template>
    <template #body-cell-actions="tableProps">
      <q-td auto-width :props="tableProps">
        <q-btn :icon="mdiOpenInNew" color="grey-color" flat round :to="`/jobs/${tableProps.row.uid}`"
          ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
            {{ t('global.open') }}
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Job } from '@/models/Job';
import { PropType, computed } from 'vue';
import { statusColors } from '@/utils/colors';
import { JobStatusEnum } from 'src/models/JobStatusEnum';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiOpenInNew } from '@quasar/extras/mdi-v6';

const { t } = useI18n();

const props = defineProps({
  jobs: {
    type: Array as PropType<Job[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'started_at',
    label: t('job.started_at'),
    field: 'createdAt',
    sortable: true,
    align: 'left',
    format: (val: string) => new Date(val).toLocaleString(),
  },
  {
    name: 'finished_at',
    label: t('job.finished_at'),
    field: 'finishedAt',
    sortable: true,
    align: 'left',
    format: (val: string) => {
      if (val) {
        return new Date(val).toLocaleString();
      }
      return t('job.not_finished');
    },
  },
  {
    name: 'step',
    label: t('job.step'),
    field: (row) => row.status?.currentStep ?? 1,
    sortable: true,
    align: 'left',
    format: (val: string, row: Job) => {
      return t('global.n_of_m', [val, row.noOfCmds]);
    },
  },
  {
    name: 'cycle',
    label: t('job.cycle'),
    field: (row) => row.status?.currentCycle ?? 1,
    sortable: true,
    align: 'left',
    format: (val: number, row: Job) => {
      return t('global.n_of_m', [val, row.noOfReps]);
    },
  },
  {
    name: 'status',
    label: t('job.status'),
    field: '',
    sortable: false,
    align: 'center',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
]);
</script>

<style lang="scss" scoped></style>
