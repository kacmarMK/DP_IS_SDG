<template>
  <PageLayout
    v-if="device.data"
    :title="device.data.name"
    :previous-title="t('device.label', 2)"
    previous-route="/devices"
  >
    <template #actions>
      <q-btn
        class="shadow bg-white"
        :to="`/devices/${device.data.uid}/jobs`"
        text-color="grey-color"
        unelevated
        no-caps
        size="15px"
        :label="t('job.label', 2)"
        :icon="mdiListStatus"
      />
      <AutoRefreshButton v-model="refreshInterval" :loading="device.isLoading" @on-refresh="refreshDevice" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('global.edit')"
        :icon="mdiPencil"
        :to="`/devices/${device.data.uid}/edit`"
      />
    </template>
    <template #default>
      <div class="q-mb-lg">
        <device-info-card :device="device.data" class="shadow container full-height"></device-info-card>
      </div>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
        <div class="col-12 col-md-12 col-lg-12 col-xl-8">
          <current-job-card
            ref="currentJobCard"
            class="shadow container q-pa-lg full-height"
            :device="device.data"
          ></current-job-card>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-4">
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
            ref="dataPointChart"
            v-model:tickedNodes="tickedNodes"
            class="bg-white shadow q-pa-lg"
            :data-point-tags="device.data.dataPointTags"
            @refresh="device.refresh()"
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
import { reactive, ref } from 'vue';
import deviceService from 'src/services/DeviceService';
import { deviceToDataPointTagNode, extractNodeKeys } from '@/utils/data-point-tag-nodes';
import SensorSelectionTree from '@/components/datapoints/SensorSelectionTree.vue';
import CurrentJobCard from '@/components/jobs/CurrentJobCard.vue';
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiPencil } from '@quasar/extras/mdi-v6';
import { useDeviceStore } from '@/stores/device-store';
import PageLayout from '@/layouts/PageLayout.vue';
import { useAsyncData } from '@/composables/useAsyncData';
import { useStorage } from '@vueuse/core';
import AutoRefreshButton from '@/components/core/AutoRefreshButton.vue';

const { t } = useI18n();

const route = useRoute();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const deviceId = route.params.id.toString();
const device = reactive(useAsyncData(getDevice, t('device.toasts.loading_failed')));

const dataPointChart = ref();
const currentJobCard = ref();

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();

async function getDevice() {
  const device = await deviceService.getDevice(deviceId);
  dataPointTagTree.value = deviceToDataPointTagNode(device);
  tickedNodes.value = extractNodeKeys(dataPointTagTree.value);
  return device;
}

function loadStoreDevice(uid: string) {
  const storedDevice = deviceStore.getDeviceById(uid);
  if (storedDevice) {
    device.data = storedDevice;
    dataPointTagTree.value = deviceToDataPointTagNode(device.data);
  }
}
loadStoreDevice(route.params.id.toString());

async function refreshDevice() {
  currentJobCard.value?.refresh();
  await device.refresh();
  dataPointChart.value?.refreshTimeRange();
}

const refreshInterval = useStorage('DeviceDetailRefreshInterval', 30);
</script>

<style lang="scss" scoped></style>
