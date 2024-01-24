<template>
  <q-page class="main-padding">
    <div v-if="device">
      <div class="q-mb-md row">
        <router-link
          class="main-text text-accent text-weight-medium z-fab"
          to="/devices"
        >
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          {{ t('device.label', 2) }} >
        </router-link>
        <p class="main-text z-fab">&nbsp;{{ device.name }}</p>
        <q-space></q-space>
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
      </div>
      <div class="row q-col-gutter-x-xl q-col-gutter-y-xl justify-between">
        <div class="col-12 col-md-12 col-lg-6 col-xl-3">
          <device-info-card
            :device="device"
            class="shadow container q-pa-lg full-height"
          ></device-info-card>
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
            v-model:tickedNodes="tickedNodes"
            class="bg-white shadow q-pa-lg"
            :data-point-tags="device.dataPointTags"
            @refresh="refreshDevice()"
          ></data-point-chart>
        </div>
      </div>
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
import { useAuthStore } from '@/stores/auth-store';
import { useI18n } from 'vue-i18n';
import { mdiListStatus, mdiPencil } from '@quasar/extras/mdi-v6';

const { t } = useI18n();

const route = useRoute();
const authStore = useAuthStore();

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

const dataPointTagTree = ref<DataPointTagNode>();
const tickedNodes = ref<string[]>();
</script>

<style lang="scss" scoped></style>
