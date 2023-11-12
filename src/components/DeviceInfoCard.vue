<template>
  <div v-if="props.device" class="column">
    <div class="text-weight-medium text-h6">Info</div>
    <div class="column q-mt-sm q-gutter-y-xs col-grow justify-evenly">
      <div class="row q-mt-sm">
        <div class="col-5 text-grey-color">Name</div>
        <div class="col-7">{{ props.device.name }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">MAC</div>
        <div class="col-7">{{ props.device.mac }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">Type</div>
        <div class="col-7">{{ props.device.type }}</div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">Version</div>
        <div class="col-7">
          {{ props.device.version }}
        </div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">Firmware</div>
        <div class="col-7">
          {{ props.device.firmware }}
        </div>
      </div>
      <div class="row">
        <div class="col-5 text-grey-color">API Key</div>
        <div class="col-7">
          {{ props.device.initApiKey }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Device } from 'src/models/Device';

const props = defineProps({
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
