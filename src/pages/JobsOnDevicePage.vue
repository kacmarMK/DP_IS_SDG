<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Job History</p>
      </div>
      <q-table
        :rows="jobs"
        :columns="columns"
        :loading="isLoadingJobs"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        no-data-label="No Jobs Yet"
        loading-label="Loading Jobs..."
      >
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="mdi-list-status" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td auto-width :props="props">
            <q-badge
              :color="statusColors[props.row.currentStatus as JobStatusEnum]"
              class="q-pa-xs"
            >
              {{ props.row.currentStatus }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Job } from 'src/models/Job';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import jobService from '../services/JobService';
import { statusColors } from '../utils/colors';
import { JobStatusEnum } from 'src/models/JobStatusEnum';

const route = useRoute();

const jobs = ref<Job[]>([]);

const isLoadingJobs = ref(false);
async function getJobs() {
  try {
    isLoadingJobs.value = true;
    jobs.value = await jobService.getJobsOnDevice(route.params.id.toString());
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingJobs.value = false;
  }
}
getJobs();

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'started_at',
    label: 'Started at',
    field: 'createdAt',
    sortable: true,
    align: 'left',
    format: (val: string) => new Date(val).toLocaleString(),
  },
  {
    name: 'finished_at',
    label: 'Finished at',
    field: 'finishedAt',
    sortable: true,
    align: 'left',
    format: (val: string) => {
      if (val) {
        return new Date(val).toLocaleString();
      }
      return 'Not finished yet';
    },
  },
  {
    name: 'step',
    label: 'Step',
    field: (row) => row.status?.currentStep || 1,
    sortable: true,
    align: 'left',
    format: (val: string, row: Job) => {
      return `${val} of ${row.noOfCmds}`;
    },
  },
  {
    name: 'cycle',
    label: 'Cycle',
    field: (row) => row.status?.currentCycle || 1,
    sortable: true,
    align: 'left',
    format: (val: number, row: Job) => {
      return `${val} of ${row.noOfReps}`;
    },
  },
  {
    name: 'status',
    label: 'Status',
    field: '',
    sortable: false,
    align: 'center',
  },
];
</script>

<style lang="scss" scoped></style>
src/models/JobStatusEnum
