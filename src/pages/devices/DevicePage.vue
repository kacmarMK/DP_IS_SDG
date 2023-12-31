<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <router-link
          class="main-text text-accent text-weight-medium z-fab"
          to="/devices"
          >Devices ></router-link
        >
        <p class="main-text z-fab">&nbsp;{{ device?.name }}</p>
        <q-space></q-space>
        <q-btn
          v-if="device"
          class="shadow bg-white q-ml-md"
          :to="`/devices/${device?.uid}/jobs`"
          text-color="grey-color"
          unelevated
          no-caps
          size="15px"
          label="Jobs"
          icon="mdi-list-status"
        />
        <q-btn
          class="shadow q-ml-md"
          color="primary"
          unelevated
          no-caps
          size="15px"
          label="Edit Device"
          icon="mdi-pencil"
          :to="`/devices/${device?.uid}/edit`"
        />
      </div>
      <div
        class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between"
        v-if="device"
      >
        <div class="col-12 col-md-12 col-lg-4 col-xl-3">
          <device-info-card
            :device="device"
            class="shadow container q-pa-lg full-height"
          ></device-info-card>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-6">
          <current-job-card
            class="shadow container q-pa-lg full-height"
            :device="device"
            :initial-jobs="device.jobs"
          ></current-job-card>
        </div>
        <div class="col-12 col-md-12 col-lg-4 col-xl-3">
          <sensor-selection-tree
            v-if="dataPointTagTree"
            :data-point-tag-tree="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            class="shadow container q-pa-lg full-height"
          ></sensor-selection-tree>
        </div>
        <div class="col-12">
          <data-point-chart
            class="bg-white shadow q-pa-lg"
            :dataPointTags="device.dataPointTags"
            v-on:refresh="refreshDevice()"
          ></data-point-chart>
        </div>
      </div>
      <div></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DeviceInfoCard from '@/components/devices/DeviceInfoCard.vue';
import DataPointChart from '@/components/datapoints/DataPointChart.vue';
import { DataPointTagNode } from '@/models/DataPointTagNode';
import { ref } from 'vue';
import deviceService from 'src/services/DeviceService';
import { handleError } from '@/utils/error-handler';
import { Device } from '@/models/Device';
import { deviceToDataPointTagNode } from '@/utils/data-point-tag-nodes';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import CurrentJobCard from '@/components/jobs/CurrentJobCard.vue';
const route = useRoute();
const device = ref<Device | null>(null);
const isLoadingDevice = ref(false);
const isRefreshingDevice = ref(false);
async function getDevice(uid: string) {
  try {
    isLoadingDevice.value = true;
    if (device.value?.uid != uid) {
      device.value = null;
    }
    device.value = await deviceService.getDevice(uid);
    dataPointTagTree.value = deviceToDataPointTagNode(device.value);
  } catch (error) {
    handleError(error, 'Loading device failed!');
  } finally {
    isLoadingDevice.value = false;
  }
}
getDevice(route.params.id.toString());

async function refreshDevice() {
  try {
    if (!device.value) {
      return;
    }
    isRefreshingDevice.value = true;
    device.value = await deviceService.getDevice(device.value.uid);
  } catch (error) {
    handleError(error, 'Refreshing device failed!');
  } finally {
    isRefreshingDevice.value = false;
  }
}

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();
</script>

<style lang="scss" scoped></style>
