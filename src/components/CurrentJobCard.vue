<template v-if="store.device">
  <div>
    <div class="column full-height">
      <div class="text-weight-medium text-h6 col-shrink">Job</div>
      <div v-if="jobLoading" class="flex justify-center items-center col-grow">
        <q-spinner-gears size="30px" color="grey-color" />
      </div>
      <div
        v-else-if="runningJob"
        class="column justify-between col-grow q-my-sm"
      >
        <div class="row justify-start items-center q-mb-lg">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="currentProgress"
            size="130px"
            :thickness="0.22"
            color="teal"
            track-color="grey-3"
            class="q-mr-md"
          >
            {{ (currentProgress * 100).toFixed(0) }}%
          </q-circular-progress>
          <div class="column q-ml-sm q-gutter-y-xs justify-center items-start">
            <q-badge :color="statusColor" class="q-pa-xs">
              {{ runningJob.currentStatus }}
            </q-badge>
            <div class="text-weight-medium">
              {{ runningJob.name }}
            </div>
            <div v-if="runningJob.status">
              Step: {{ runningJob.status.currentStep + 1 }} of
              {{ runningJob.status.totalSteps }} ({{
                runningJob.commands[currentStep].name
              }})
            </div>
            <div v-if="runningJob.status">
              Cycle: {{ runningJob.status.currentCycle + 1 }} of
              {{ runningJob.noOfReps }}
            </div>
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-grow">
            <JobControlButton
              label="Pause"
              color="grey-color"
              icon="mdi-pause"
              :disable="
                runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING
              "
            ></JobControlButton>
          </div>
          <div class="col-grow">
            <JobControlButton
              label="Next Step"
              color="green-9"
              icon="mdi-skip-next"
              :disable="
                runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING
              "
            ></JobControlButton>
          </div>
          <div class="col-grow">
            <JobControlButton
              label="Next Cycle"
              color="primary"
              icon="mdi-skip-forward"
              :disable="
                runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING
              "
            ></JobControlButton>
          </div>
          <div class="col-grow">
            <JobControlButton
              label="Stop"
              color="red"
              icon="mdi-stop"
            ></JobControlButton>
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
    <StartJobDialog v-model="openDialog" @job-started="getRunningJob" />
  </div>
</template>

<script setup lang="ts">
import { useDevicesStore } from '../stores/devices-store';
import StartJobDialog from '../components/StartJobDialog.vue';
import { computed, ref } from 'vue';
import { JobStatusEnum } from 'src/models/JobStatus';
import { Job } from 'src/models/Job';
import jobService from 'src/services/JobService';
import JobControlButton from './JobControlButton.vue';

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

const currentStep = computed(() => {
  if (runningJob.value && runningJob.value.status.currentStep) {
    return runningJob.value.status.currentStep;
  }
  return 0;
});

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
