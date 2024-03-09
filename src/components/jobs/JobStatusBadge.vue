<template>
  <q-badge v-if="status" :color="statusColors[status as JobStatusEnum]">
    {{ status }}
  </q-badge>
</template>

<script setup lang="ts">
import { JobStatusEnum } from '@/models/JobStatusEnum';
import { statusColors } from '@/utils/colors';

defineProps({
  status: {
    type: String,
    default: '',
  },
});
</script>
