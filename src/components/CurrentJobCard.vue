<template v-if="store.device">
  <div>
    <div class="column full-height">
      <div class="text-weight-medium text-h6 col-shrink">Job</div>
      <div v-if="runningJob" class="column justify-between col-grow q-my-sm">
        <div class="row justify-start items-center q-mb-lg">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="currentProgress"
            size="100px"
            :thickness="0.22"
            color="teal"
            track-color="grey-3"
            class="q-mr-md"
          >
            {{ (currentProgress * 100).toFixed(0) }}%
          </q-circular-progress>
          <div class="column q-ml-sm q-gutter-y-xs justify-center items-start">
            <div class="row">
              <q-badge :color="statusColor" class="q-pa-xs">
                {{ runningJob.currentStatus }}
              </q-badge>
              <q-badge
                v-if="runningJob.toCancel"
                color="red"
                class="q-pa-xs q-ml-sm"
              >
                STOPPING
              </q-badge>
            </div>
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
              :loading="pausingJob"
              @click="pauseJob"
              :disable="
                runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING
              "
            ></JobControlButton>
          </div>
          <div class="col-grow">
            <JobControlButton
              label="Skip Step"
              color="green-9"
              icon="mdi-skip-next"
              :loading="skipStepLoading"
              @click="skipStep"
              :disable="
                runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING
              "
            ></JobControlButton>
          </div>
          <div class="col-grow">
            <JobControlButton
              label="Skip Cycle"
              color="primary"
              icon="mdi-skip-forward"
              :loading="skipCycleLoading"
              @click="skipCycle"
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
              :loading="stoppingJob"
              @click="stopJob"
              :disable="runningJob.toCancel == true"
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
          @click.stop="openDialog = true"
        />
      </div>
    </div>
    <StartJobDialog v-model="openDialog" @job-started="getRunningJob" />
  </div>
</template>

<script setup lang="ts">
import { useDevicesStore } from '../stores/devices-store';
import StartJobDialog from '../components/StartJobDialog.vue';
import { computed, ref, onMounted, onUnmounted, Ref, PropType } from 'vue';
import { JobStatusEnum } from 'src/models/JobStatus';
import { Job } from 'src/models/Job';
import jobService from 'src/services/JobService';
import JobControlButton from './JobControlButton.vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  initialJobs: {
    type: Array as PropType<Job[]>,
    required: true,
  },
});

const openDialog = ref(false);
const store = useDevicesStore();
const runningJob = ref<Job | undefined>(findActiveJob(props.initialJobs));

function findActiveJob(jobs: Job[]) {
  return jobs.find(
    (job) =>
      job.currentStatus == JobStatusEnum.JOB_PENDING ||
      job.currentStatus == JobStatusEnum.JOB_PROCESSING
  );
}

async function getRunningJob() {
  if (store.device) {
    try {
      const jobs: Job[] = await jobService.getJobsOnDevice(store.device.uid);
      return findActiveJob(jobs);
    } catch (error) {
      console.log('No running job found');
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

//Job actions
async function performJobAction(
  action: { (jobId: string): Promise<Job[]> },
  successMessage: string,
  errorMessage: string,
  loadingRef: Ref<boolean>
) {
  if (!runningJob.value) return;
  try {
    loadingRef.value = true;
    await action(runningJob.value.uid);
    toast.success(successMessage);
    getRunningJob();
  } catch (e) {
    toast.error(errorMessage);
  } finally {
    loadingRef.value = false;
  }
}

const stoppingJob = ref(false);
async function stopJob() {
  await performJobAction(
    jobService.cancelJob,
    'Job stopped',
    'Error stopping job',
    stoppingJob
  );
}

const pausingJob = ref(false);
async function pauseJob() {
  await performJobAction(
    jobService.pauseJob,
    'Job paused',
    'Error pausing job',
    pausingJob
  );
}

const skipStepLoading = ref(false);
async function skipStep() {
  await performJobAction(
    jobService.skipStep,
    'Skipped step',
    'Error skipping step',
    skipStepLoading
  );
}

const skipCycleLoading = ref(false);
async function skipCycle() {
  await performJobAction(
    jobService.skipCycle,
    'Skipped cycle',
    'Error skipping cycle',
    skipCycleLoading
  );
}

//Refresh job every N seconds
const refreshInterval = 10; // in seconds
const intervalId = ref<NodeJS.Timeout>();
onMounted(() => {
  intervalId.value = setInterval(getRunningJob, refreshInterval * 1000);
});

// Stop the interval when the component is unmounted to prevent memory leaks
onUnmounted(() => {
  clearInterval(intervalId.value);
});
</script>

<style lang="scss" scoped></style>
