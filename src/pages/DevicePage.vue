<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <router-link
          class="main-text text-accent text-weight-medium z-fab"
          to="/devices"
          >Devices ></router-link
        >
        <p class="main-text">&nbsp;{{ store.device?.name }}</p>
        <q-space></q-space>
        <q-btn
          class="shadow q-ml-md"
          color="primary"
          unelevated
          no-caps
          size="15px"
          label="Edit Device"
        />
      </div>
      <div
        class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between"
        v-if="store.device"
      >
        <div class="col-12 col-md-12 col-lg-4 col-xl-3">
          <device-info-card
            :device="store.device"
            class="shadow container q-pa-lg full-height"
          ></device-info-card>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-6">
          <current-job-card
            class="shadow container q-pa-lg full-height"
            :initial-jobs="store.device.jobs"
          ></current-job-card>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-3">
          <device-sensors-list
            class="shadow container q-pa-lg full-height"
          ></device-sensors-list>
        </div>
        <div class="col-12">
          <device-chart class="bg-white shadow q-pa-lg"></device-chart>
        </div>
      </div>
      <div></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useDevicesStore } from '../stores/devices-store';
import DeviceInfoCard from '../components/DeviceInfoCard.vue';
import DeviceSensorsList from 'src/components/DeviceSensorsList.vue';
import DeviceChart from 'src/components/DeviceChart.vue';
import CurrentJobCard from 'src/components/CurrentJobCard.vue';

const route = useRoute();
const store = useDevicesStore();
store.getDevice(route.params.id.toString());
</script>

<style lang="scss" scoped></style>
