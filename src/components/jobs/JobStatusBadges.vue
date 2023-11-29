<template>
  <div class="row">
    <q-badge :color="statusColors[job.currentStatus]" class="q-pa-xs">
      {{ props.job.currentStatus }}
    </q-badge>
    <q-badge v-if="props.job.toCancel" color="red" class="q-pa-xs q-ml-sm">
      STOPPING
    </q-badge>
    <q-badge v-if="props.job.paused" color="accent" class="q-pa-xs q-ml-sm">
      PAUSED
    </q-badge>
  </div>
</template>

<script setup lang="ts">
import { Job } from '@/models/Job';
import { statusColors } from '@/utils/colors';
import { PropType } from 'vue';

const props = defineProps({
  job: {
    type: Object as PropType<Job>,
    required: true,
  },
});
</script>
