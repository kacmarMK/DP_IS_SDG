<template>
  <div class="row q-col-gutter-sm items-center justify-center">
    <div class="col-12 col-sm-3" v-if="!runningJob.paused">
      <JobControlButton
        label="Pause"
        color="grey-color"
        icon="mdi-pause"
        :loading="pausingJob"
        @click="pauseJob"
        :disable="runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING"
      ></JobControlButton>
    </div>
    <div class="col-12 col-sm-3" v-else>
      <JobControlButton
        label="Resume"
        color="primary"
        icon="mdi-play"
        :loading="resumingJob"
        @click="resumeJob"
        :disable="runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING"
      ></JobControlButton>
    </div>
    <div class="col-12 col-sm-3">
      <JobControlButton
        label="Skip Step"
        color="green-9"
        icon="mdi-skip-next"
        :loading="skipStepLoading"
        @click="skipStep"
        :disable="runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING"
      ></JobControlButton>
    </div>
    <div class="col-12 col-sm-3">
      <JobControlButton
        label="Skip Cycle"
        color="primary"
        icon="mdi-skip-forward"
        :loading="skipCycleLoading"
        @click="skipCycle"
        :disable="runningJob.currentStatus != JobStatusEnum.JOB_PROCESSING"
      ></JobControlButton>
    </div>
    <div class="col-12 col-sm-3">
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
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify';
import { JobStatusEnum } from '@/models/JobStatusEnum';
import { Job } from '@/models/Job';
import { PropType, ref, Ref } from 'vue';
import jobService from '@/services/JobService';
import JobControlButton from './JobControlButton.vue';

const props = defineProps({
  runningJob: {
    type: Object as PropType<Job>,
    required: true,
  },
});

const emit = defineEmits(['action-performed']);

//Job actions
async function performJobAction(
  action: { (jobId: string): Promise<Job> },
  successMessage: string,
  errorMessage: string,
  loadingRef: Ref<boolean>
) {
  if (!props.runningJob) return;
  try {
    loadingRef.value = true;
    await action(props.runningJob.uid);
    toast.success(successMessage);
    emit('action-performed');
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

const resumingJob = ref(false);
async function resumeJob() {
  await performJobAction(
    jobService.continueJob,
    'Job resumed',
    'Error resuming job',
    resumingJob
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
</script>
src/models/JobStatusEnum
