<template>
  <q-dialog v-model="store.deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Device</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to delete this device?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
          color="red"
          :loading="store.deleteInProgress"
          no-caps
          @click="store.deleteDevice()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDevicesStore } from '../stores/devices-store';

const store = useDevicesStore();
store.getDevices();
</script>

<style lang="scss" scoped></style>
../stores/device-store
