<template v-if="store.device">
  <div>
    <div class="column full-height">
      <div class="text-weight-medium text-h6 full-width col-shrink">Job</div>
      <div v-if="jobLoading" class="flex justify-center items-center col-grow">
        <q-spinner-gears size="30px" color="grey-color" />
      </div>
      <div v-else-if="runningJob" class="row">
        <q-circular-progress
          show-value
          font-size="12px"
          :value="currentProgress"
          size="80px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        >
          {{ (currentProgress * 100).toFixed(1) }}%
        </q-circular-progress>
        <div class="column q-ml-sm q-gutter-y-sm justify-center">
          <q-badge :color="statusColor" class="q-pa-xs">
            {{ runningJob.currentStatus }}
          </q-badge>
          <div class="text-weight-medium">
            {{ runningJob.name }}
          </div>
          <div v-if="runningJob.status">
            Cycle {{ runningJob.status.currentCycle + 1 }} of
            {{ runningJob.noOfReps }}
          </div>
        </div>
      </div>
      <div v-else class="column items-center justify-center col-grow">
        <div class="q-mb-sm">No running job</div>
        <q-btn
          class="shadow"
          color="grey-color"
          outline
          unelevated
          no-caps
          size="15px"
          label="Run New Job"
          @click="openDialog = true"
        />
      </div>
    </div>
    <StartJobDialog v-model="openDialog" />
  </div>
</template>

<script setup lang="ts">
import { useDevicesStore } from '../stores/devices-store';
import StartJobDialog from '../components/StartJobDialog.vue';
import { computed, ref } from 'vue';
import { JobStatusEnum } from 'src/models/JobStatus';
import { Job } from 'src/models/Job';
import jobService from 'src/services/JobService';

const openDialog = ref(false);

const store = useDevicesStore();

const runningJob = ref<Job>();
const jobLoading = ref(false);
async function getRunningJob() {
  if (store.device) {
    try {
      runningJob.value = undefined;
      jobLoading.value = true;

      const jobs: Job[] = await jobService.getJobsOnDevice(store.device.uid);

      const runningJobs = jobs.filter(
        (job) =>
          job.currentStatus == JobStatusEnum.JOB_PENDING ||
          job.currentStatus == JobStatusEnum.JOB_PROCESSING
      );

      console.log(runningJobs);

      if (runningJobs.length > 0) {
        runningJob.value = runningJobs[0];
      }
    } catch (error) {
      console.log('No running job found');
    } finally {
      jobLoading.value = false;
    }
  }
}
getRunningJob();

const currentProgress = computed(() => {
  if (runningJob.value && runningJob.value.status) {
    const total =
      runningJob.value.noOfReps * runningJob.value.status.totalSteps;
    const current =
      runningJob.value.status.currentStep +
      runningJob.value.status.currentCycle * runningJob.value.status.totalSteps;
    return current * total;
  }
  return 0;
});

const statusColor = computed(() => {
  if (runningJob.value) {
    switch (runningJob.value.currentStatus) {
      case JobStatusEnum.JOB_PENDING:
        return 'accent';
      case JobStatusEnum.JOB_PROCESSING:
        return 'primary';
      default:
        return 'accent';
    }
  }
  return 'grey';
});
</script>

<style lang="scss" scoped></style>
