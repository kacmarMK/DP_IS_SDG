<template>
  <PageLayout v-if="device" :title="device.name" :previous-title="t('device.label', 2)" previous-route="/devices">
    <template #actions>
      <q-btn
        class="shadow bg-white"
        :to="`/devices/${device.uid}/jobs`"
        text-color="grey-color"
        unelevated
        no-caps
        size="15px"
        :label="t('job.label', 2)"
        :icon="mdiListStatus"
      />
      <AutoRefreshButton v-model="refreshInterval" :loading="deviceIsLoading" @on-refresh="refreshDevice" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('global.edit')"
        :icon="mdiPencil"
        :to="`/devices/${device.uid}/edit`"
      />
    </template>
    <template #default>
      <div class="q-mb-lg">
        <device-info-card :device="device" class="shadow container full-height"></device-info-card>
      </div>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
        <div class="col-12 col-md-12 col-lg-12 col-xl-8">
          <CurrentJobCard
            ref="currentJobCard"
            class="shadow container q-pa-lg full-height"
            :device="device"
          ></CurrentJobCard>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-4">
          <SensorSelectionTree
            v-if="dataPointTagTree"
            v-model:tickedNodes="tickedNodes"
            :data-point-tag-tree="dataPointTagTree"
            class="shadow container q-pa-lg full-height"
          ></SensorSelectionTree>
        </div>
        <div class="col-12">
          <DataPointChart
            v-if="device && dataPointTagTree"
            ref="dataPointChart"
            v-model:tickedNodes="tickedNodes"
            class="bg-white shadow q-pa-lg"
            :data-point-tags="device.dataPointTags"
            @refresh="getDevice"
          ></DataPointChart>
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
import { deviceToDataPointTagNode, extractNodeKeys } from '@/utils/data-point-tag-nodes';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import CurrentJobCard from '@/components/jobs/CurrentJobCard.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiPencil } from '@quasar/extras/mdi-v6';
import { useDeviceStore } from '@/stores/device-store';
import PageLayout from '@/layouts/PageLayout.vue';
import { useStorage } from '@vueuse/core';
import AutoRefreshButton from '@/components/core/AutoRefreshButton.vue';
import { toast } from 'vue3-toastify';
import { Device } from '@/models/Device';

const { t } = useI18n();

const route = useRoute();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const deviceId = route.params.id.toString();
const device = ref<Device>();
const deviceIsLoading = ref(false);

const dataPointChart = ref();
const currentJobCard = ref();

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();

async function getDevice() {
  try {
    deviceIsLoading.value = true;
    const deviceRes = await deviceService.getDevice(deviceId);
    if (!tickedNodes.value || !dataPointTagTree.value) {
      dataPointTagTree.value = deviceToDataPointTagNode(deviceRes);
      tickedNodes.value = extractNodeKeys(dataPointTagTree.value);
    }
    device.value = deviceRes;
  } catch (error) {
    toast.error(t('device.toasts.loading_failed'));
  } finally {
    deviceIsLoading.value = false;
  }
}
getDevice();

function loadStoreDevice(uid: string) {
  const storedDevice = deviceStore.getDeviceById(uid);
  if (storedDevice) {
    device.value = storedDevice;
    dataPointTagTree.value = deviceToDataPointTagNode(device.value);
  }
}
loadStoreDevice(route.params.id.toString());

async function refreshDevice() {
  currentJobCard.value?.refresh();
  await getDevice();
}

const refreshInterval = useStorage('DeviceDetailRefreshInterval', 30);
</script>

<style lang="scss" scoped></style>
