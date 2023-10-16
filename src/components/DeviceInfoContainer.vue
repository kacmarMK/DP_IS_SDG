<template>
  <div v-if="store.device" class="shadow container q-pa-lg">
    <div class="text-weight-medium text-h6">Device info</div>
    <div class="row q-mt-md q-gutter-y-xs">
      <div class="full-width row">
        <div class="col-5 text-weight-medium">Name</div>
        <div class="col-7 text-grey-color">{{ store.device.name }}</div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">MAC</div>
        <div class="col-7 text-grey-color">{{ store.device.mac }}</div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">Type</div>
        <div class="col-7 text-grey-color">{{ store.device.type }}</div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">Version</div>
        <div class="col-7 text-grey-color">
          {{ store.device.version }}
        </div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">Firmware</div>
        <div class="col-7 text-grey-color">
          {{ store.device.firmware }}
        </div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">API Key</div>
        <div class="col-7 text-grey-color">
          {{ store.device.initApiKey }}
        </div>
      </div>
      <div class="full-width row">
        <div class="col-5 text-weight-medium">Deactivated</div>
        <div class="col-7 text-grey-color">
          {{ store.device.deactivated }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useDevicesStore } from '../stores/devices-store';

const route = useRoute();
const store = useDevicesStore();
store.getDevice(route.params.id.toString());
</script>

<style lang="scss" scoped></style>
