<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">Devices</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          label="Add Device"
          icon="mdi-plus"
          to="/devices/create"
        />
      </div>
      <DevicesTable
        v-model="store.devices"
        :loading="store.isLoadingDevices"
        class="shadow"
        @on-change="store.getDevices"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useDevicesStore } from '@/stores/devices-store';
import DevicesTable from '@/components/devices/DevicesTable.vue';

const store = useDevicesStore();
store.getDevices();
</script>

<style lang="scss" scoped></style>
