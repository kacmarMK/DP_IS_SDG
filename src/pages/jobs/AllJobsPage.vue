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
        rows-per-page-label="Jobs per page"
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
        <template v-slot:body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              icon="mdi-open-in-new"
              color="grey-color"
              flat
              round
              :to="`/jobs/${props.row.uid}`"
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                Open
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Job } from '@/models/Job';
import { ref } from 'vue';
import deviceService from '@/services/DeviceService';
import { statusColors } from '@/utils/colors';
import { JobStatusEnum } from '@/models/JobStatusEnum';
import { JobDevice } from '@/models/Job';
import { handleError } from '@/utils/error-handler';

const jobs = ref<JobDevice[]>([]);

const isLoadingJobs = ref(false);
async function getJobs() {
  try {
    isLoadingJobs.value = true;
    const devices = await deviceService.getDevices();
    jobs.value = devices.flatMap((device) =>
      device.jobs.map((job) => ({
        ...job,
        deviceName: device.name,
      })),
    );
  } catch (error) {
    console.log('ahoj');
    handleError(error, 'Loading jobs failed!');
  } finally {
    isLoadingJobs.value = false;
  }
}
getJobs();

const columns: QTableProps['columns'] = [
  {
    name: 'device',
    label: 'Device',
    field: 'deviceName',
    sortable: true,
    align: 'left',
  },
  {
    name: 'recipe',
    label: 'Recipe',
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
    sortable: true,
    align: 'center',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
];
</script>

<style lang="scss" scoped></style>
