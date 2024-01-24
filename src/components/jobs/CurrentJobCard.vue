<template v-if="store.device">
  <div>
    <div class="column full-height">
      <div class="row items-center">
        <div class="text-weight-medium text-h6 col-shrink">
          {{ t('job.label') }}
        </div>
        <q-space></q-space>
        <q-btn
          v-if="runningJob"
          dense
          size="14px"
          :icon="mdiOpenInNew"
          color="grey-color"
          :to="`/jobs/${runningJob?.uid}`"
          flat
          round
          ><q-tooltip :offset="[0, 4]">{{ t('global.details') }}</q-tooltip>
        </q-btn>
      </div>
      <div
        v-if="runningJob"
        class="column justify-between col-grow q-my-sm wrap"
      >
        <div class="row justify-start items-center q-mb-sm">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="currentProgress * 100"
            size="100px"
            :thickness="0.22"
            color="primary"
            track-color="grey-3"
            class="q-mr-md"
          >
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            {{ (currentProgress * 100).toFixed(0) }}%
          </q-circular-progress>
          <div
            class="column q-ml-sm q-gutter-y-xs justify-center q-my-md items-start"
          >
            <JobStatusBadges :job="runningJob" />
            <div class="text-weight-medium">
              {{ runningJob.name }}
            </div>
            <div>
              {{
                t('job.step_of', [
                  runningJob.status?.currentStep ?? 1,
                  runningJob.noOfCmds,
                ])
              }}
              <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
              <span>({{ currentCommandName }})</span>
            </div>
            <div>
              {{
                t('job.cycle_of', [
                  runningJob.status?.currentCycle ?? 1,
                  runningJob.noOfReps,
                ])
              }}
            </div>
          </div>
        </div>
        <JobControls
          v-if="authStore.isAdmin"
          class="col-grow"
          :running-job="runningJob"
          @action-performed="getRunningJob"
        />
      </div>
      <div v-else class="column items-center justify-center col-grow">
        <div class="q-mb-sm">{{ t('job.no_running_job') }}</div>
        <q-btn
          class="shadow"
          color="grey-color"
          outline
          unelevated
          no-caps
          size="15px"
          :label="t('job.run_job')"
          @click.stop="openDialog = true"
        />
      </div>
    </div>
    <StartJobDialog
      v-model="openDialog"
      :device="props.device"
      @job-started="getRunningJob"
    />
  </div>
</template>

<script setup lang="ts">
import StartJobDialog from '@/components/jobs/StartJobDialog.vue';
import { computed, ref, onMounted, onUnmounted, PropType } from 'vue';
import { JobStatusEnum } from '@/models/JobStatusEnum';
import { Job } from '@/models/Job';
import jobService from '@/services/JobService';
import JobControls from './JobControls.vue';
import JobStatusBadges from './JobStatusBadges.vue';
import { Device } from '@/models/Device';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiOpenInNew } from '@quasar/extras/mdi-v6';

const { t } = useI18n();

const props = defineProps({
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
  initialJobs: {
    type: Array as PropType<Job[]>,
    required: true,
  },
});

const authStore = useAuthStore();

const openDialog = ref(false);
const runningJob = ref<Job | undefined>(findActiveJob(props.initialJobs));

function findActiveJob(jobs: Job[]) {
  jobs = jobs.sort((a, b) => {
    if (a.currentStatus == JobStatusEnum.JOB_PENDING) {
      return 1;
    }
    if (b.currentStatus == JobStatusEnum.JOB_PENDING) {
      return -1;
    }
    return 0;
  });

  return jobs.find(
    (job) =>
      job.currentStatus == JobStatusEnum.JOB_PROCESSING ||
      job.currentStatus == JobStatusEnum.JOB_PENDING,
  );
}

async function getRunningJob() {
  if (props.device) {
    try {
      const jobs: Job[] = await jobService.getJobsOnDevice(props.device.uid);
      runningJob.value = findActiveJob(jobs);
    } catch (error) {
      console.log(error);
    }
  }
}
getRunningJob();

const currentProgress = computed(() => {
  if (runningJob.value && runningJob.value.status) {
    const { status, noOfReps, noOfCmds } = runningJob.value;
    const total = noOfReps * noOfCmds;

    const current =
      status.currentStep + ((status.currentCycle ?? 1) - 1) * noOfCmds;

    return Math.min(current / total, 1);
  }
  return 0;
});

const currentCommandName = computed(() => {
  if (runningJob.value && runningJob.value.status) {
    const { status, commands } = runningJob.value;
    return commands[(status.currentStep ?? 1) - 1].name ?? '';
  }
  return '';
});

//Refresh job every N seconds
const refreshInterval = 10; // in seconds
const intervalId = ref();
onMounted(() => {
  intervalId.value = setInterval(getRunningJob, refreshInterval * 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value);
});
</script>

<style lang="scss" scoped></style>
