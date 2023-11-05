<template>
  <div v-if="store.device">
    <div class="text-weight-medium text-h6">Sensors</div>
    <div class="column q-mt-sm q-gutter-y-sm">
      <div v-for="sensor in store.device.dataPointTags" :key="sensor.uid">
        <q-checkbox
          v-model="selected"
          :label="`${sensor.name} (${sensor.unit})`"
          color="primary"
          dense
        ></q-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDevicesStore } from '../stores/devices-store';
const store = useDevicesStore();

const selected = ref(false);
</script>

<style lang="scss" scoped></style>
