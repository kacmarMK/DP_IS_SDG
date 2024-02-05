<template>
  <PageLayout v-if="device" :title="device.name" :previous-title="t('device.label', 2)" previous-route="/devices">
    <template #actions>
      <q-btn
        class="shadow bg-white q-ml-md"
        :to="`/devices/${device?.uid}/jobs`"
        text-color="grey-color"
        unelevated
        no-caps
        size="15px"
        :label="t('job.label', 2)"
        :icon="mdiListStatus"
      />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow q-ml-md"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('global.edit')"
        :icon="mdiPencil"
        :to="`/devices/${device?.uid}/edit`"
      />
    </template>
    <template #default>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
        <div class="col-12 col-md-12 col-lg-6 col-xl-3">
          <device-info-card :device="device" class="shadow container q-pa-lg full-height"></device-info-card>
        </div>
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <current-job-card
            class="shadow container q-pa-lg full-height"
            :device="device"
            :initial-jobs="device.jobs"
          ></current-job-card>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-3">
          <sensor-selection-tree
            v-if="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            :data-point-tag-tree="dataPointTagTree"
            class="shadow container q-pa-lg full-height"
          ></sensor-selection-tree>
        </div>
        <div class="col-12">
          <data-point-chart
            v-if="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            class="bg-white shadow q-pa-lg"
            :data-point-tags="device.dataPointTags"
            @refresh="refreshDevice()"
          ></data-point-chart>
        </div>
      </div>
    </template>
  </PageLayout>
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
import { deviceToDataPointTagNode, extractNodeKeys } from '@/utils/data-point-tag-nodes';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import CurrentJobCard from '@/components/jobs/CurrentJobCard.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiPencil } from '@quasar/extras/mdi-v6';
import { useDeviceStore } from '@/stores/device-store';
import PageLayout from '@/layouts/PageLayout.vue';

const { t } = useI18n();

const route = useRoute();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const device = ref<Device | null>(null);
const isLoadingDevice = ref(false);
const isRefreshingDevice = ref(false);

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();

function loadStoreDevice(uid: string) {
  const storedDevice = deviceStore.getDeviceById(uid);
  if (storedDevice) {
    device.value = storedDevice;
    dataPointTagTree.value = deviceToDataPointTagNode(device.value);
  }
}
loadStoreDevice(route.params.id.toString());

async function getDevice(uid: string) {
  try {
    isLoadingDevice.value = true;
    if (device.value?.uid != uid) {
      device.value = null;
    }
    device.value = await deviceService.getDevice(uid);
    dataPointTagTree.value = deviceToDataPointTagNode(device.value);
    tickedNodes.value = extractNodeKeys(dataPointTagTree.value);
  } catch (error) {
    handleError(error, t('device.toasts.loading_failed'));
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
    handleError(error, t('device.toasts.loading_failed'));
  } finally {
    isRefreshingDevice.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
