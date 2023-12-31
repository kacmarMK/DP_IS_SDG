<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row items-center">
        <p class="main-text">Job</p>
        <p class="job-name text-weight-medium" v-if="job">({{ job.name }})</p>
        <q-badge class="q-pa-xs q-ml-sm" color="primary">
          Cycle: {{ job?.status.currentCycle ?? 1 }}/{{ job?.noOfReps }}
        </q-badge>
        <job-status-badges
          class="q-ml-sm"
          v-if="job"
          :job="job"
        ></job-status-badges>
        <q-space></q-space>
        <job-controls
          class="col-grow"
          v-if="job"
          :running-job="job"
          @action-performed="getJob"
        ></job-controls>
      </div>
      <q-table
        :rows="steps"
        :columns="columns"
        :loading="isLoadingJob"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        no-data-label="No steps"
        loading-label="Loading Job..."
        hide-bottom
      >
        <template v-slot:no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon name="mdi-list-status" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>
        <template v-slot:body-cell-progress="props">
          <q-td auto-width :props="props">
            <div
              style="min-height: 45px"
              class="row items-center justify-center"
            >
              <div
                v-if="
                  currentStep >= props.row.step &&
                  currentStep < props.row.step + props.row.cycles
                "
                class="row items-center justify-center"
              >
                <q-circular-progress
                  size="32px"
                  :thickness="0.15"
                  color="primary"
                  show-value
                  :indeterminate="
                    !job?.paused &&
                    job?.currentStatus == JobStatusEnum.JOB_PROCESSING
                  "
                >
                  <div class="current-step-progress">
                    {{ currentStepCycle }}/{{ props.row.cycles }}
                  </div>
                </q-circular-progress>
              </div>
              <q-icon
                v-else-if="props.row.step < currentStep"
                name="mdi-check"
                size="28px"
                color="green"
              ></q-icon>
              <q-icon v-else name="mdi-check" size="28px" color="grey"></q-icon>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-step="props">
          <q-td auto-width :props="props">
            {{ props.row.step }}
          </q-td>
        </template>
        <template v-slot:body-cell-cycles="props">
          <q-td auto-width :props="props">
            {{ props.row.cycles }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { Job } from '@/models/Job';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import jobService from '@/services/JobService';
import JobControls from '@/components/jobs/JobControls.vue';
import { JobStatusEnum } from '@/models/JobStatusEnum';
import JobStatusBadges from '@/components/jobs/JobStatusBadges.vue';

const route = useRoute();

const job = ref<Job>();

const isLoadingJob = ref(false);
async function getJob() {
  try {
    isLoadingJob.value = true;
    job.value = await jobService.getJobById(route.params.id.toString());
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingJob.value = false;
  }
}
getJob();

const currentStep = computed(() => {
  if (!job.value || !job.value.status || !job.value.status.currentStep)
    return 1;
  return job.value.status.currentStep;
});

const currentStepCycle = computed(() => {
  if (!job.value?.status || !steps.value.length) return 1;

  const currentStepIndex = steps.value.findIndex(
    (step) =>
      currentStep.value > step.step &&
      currentStep.value < step.step + step.cycles,
  );

  if (currentStepIndex === -1) return 1;

  const currentStepObj = steps.value[currentStepIndex];
  return currentStep.value - currentStepObj.step + 1;
});

const steps = computed(() => {
  if (!job.value || !job.value.commands) return [];

  const groupedCommands: { step: number; name?: string; cycles: number }[] = [];
  let lastCommandId: string = job.value.commands[0].id;
  let cycleCount = 0;

  job.value.commands.forEach((command, index) => {
    if (command.id !== lastCommandId) {
      groupedCommands.push({
        step: index - cycleCount + 1,
        name: job.value?.commands[index - 1].name,
        cycles: cycleCount,
      });
      lastCommandId = command.id;
      cycleCount = 1;
    } else {
      cycleCount++;
    }
  });

  if (job.value.commands.length > 0 && cycleCount > 0) {
    groupedCommands.push({
      step: job.value.commands.length,
      name: job.value.commands[job.value.commands.length - 1].name,
      cycles: cycleCount,
    });
  }

  return groupedCommands;
});

const columns: QTableProps['columns'] = [
  {
    name: 'progress',
    label: 'Progress',
    field: '',
    sortable: false,
    align: 'center',
  },
  {
    name: 'step',
    label: 'Step',
    field: 'step',
    sortable: false,
    align: 'center',
  },
  {
    name: 'cycles',
    label: 'Cycles',
    field: 'cycles',
    sortable: false,
    align: 'center',
  },
  {
    name: 'name',
    label: 'Command',
    field: 'name',
    sortable: false,
    align: 'left',
  },
];

//Refresh job every N seconds
const refreshInterval = 10; // in seconds
const intervalId = ref<NodeJS.Timeout>();
onMounted(() => {
  intervalId.value = setInterval(getJob, refreshInterval * 1000);
});

onUnmounted(() => {
  clearInterval(intervalId.value);
});
</script>

<style lang="scss" scoped>
.job-name {
  font-size: 1.8em;
  font-weight: 600;
  margin: 0 0 0 0.75rem;
  padding: 0;
  color: $accent;
}

.current-step-progress {
  font-size: 0.75rem;
  font-weight: 500;
  color: $primary;
}
</style>
