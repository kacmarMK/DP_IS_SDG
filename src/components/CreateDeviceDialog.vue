<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Create new device</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input label="Name" v-model="store.deviceCreate.name" />
        <q-input label="Mac" v-model="store.deviceCreate.mac" />
        <q-select
          label="Type"
          v-model="store.deviceCreate.type"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-input label="Version" v-model="store.deviceCreate.version" />
        <q-input label="Firmware" v-model="store.deviceCreate.firmware" />
        <q-input label="Init API Key" v-model="store.deviceCreate.initApiKey" />
        <q-checkbox
          class="q-mt-lg"
          v-model="store.deviceCreate.deactivated"
          dense
          label="Deactivated"
          color="primary"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          color="primary"
          label="Create device"
          no-caps
          @click="store.createDevice"
          :loading="store.isCreatingDevice"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DeviceTypeEnum from 'src/models/DeviceType';
import { useDevicesStore } from '../stores/devices-store';

const store = useDevicesStore();
store.getDevices();
</script>

<style lang="scss" scoped></style>
../stores/device-store
