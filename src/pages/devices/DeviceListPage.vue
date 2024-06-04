<template>
  <PageLayout :title="t('device.label', 2)">
    <template #actions>
      <SearchBar v-model="filter" />
      <AutoRefreshButton v-model="refreshInterval" :loading="loadingDevices" @on-refresh="getDevices(pagination)" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        unelevated
        no-caps
        size="15px"
        :label="t('device.add_device')"
        :icon="mdiPlus"
        to="/devices/create"
      />
    </template>
    <template #default>
      <DevicesTable
        v-model:pagination="pagination"
        :devices="devicesPaginated?.content ?? []"
        :loading="loadingDevices"
        :filter="filter"
        class="shadow"
        @on-change="getDevices"
        @on-request="onRequest"
      />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/devices/DevicesTable.vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import PageLayout from '@/layouts/PageLayout.vue';
import { ref } from 'vue';
import SearchBar from '@/components/core/SearchBar.vue';
import { useStorage } from '@vueuse/core';
import AutoRefreshButton from '@/components/core/AutoRefreshButton.vue';
import { PaginatedResponse, Pagination } from '@/models/Pagination';
import { Device } from '@/models/Device';
import DeviceService from '@/services/DeviceService';
import { handleError } from '@/utils/error-handler';

const { t } = useI18n();
const authStore = useAuthStore();
const filter = ref('');

// Setup for automatic refresh
const refreshInterval = useStorage('DeviceListRefreshInterval', 30);

const pagination = ref<Pagination>({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});
const devicesPaginated = ref<PaginatedResponse<Device>>();
const loadingDevices = ref(false);

async function onRequest(props: { pagination: Pagination }) {
  await getDevices(props.pagination);
}

async function getDevices(paginationPar: Pagination) {
  try {
    loadingDevices.value = true;
    devicesPaginated.value = await DeviceService.getDevicesPaged(paginationPar);

    const { page, rowsPerPage, sortBy, descending } = paginationPar;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    pagination.value.rowsNumber = devicesPaginated.value.totalElements;
  } catch (error) {
    handleError(error, t('device.toasts.loading_failed'));
  } finally {
    loadingDevices.value = false;
  }
}
getDevices(pagination.value);
</script>
