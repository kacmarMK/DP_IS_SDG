<template>
  <PageLayout :title="t('device.label', 2)">
    <template #actions>
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
        v-model="deviceStore.devices"
        :loading="deviceStore.isLoadingDevices"
        class="shadow"
        @on-change="deviceStore.getDevices"
      />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { useDeviceStore } from '@/stores/device-store';
import DevicesTable from '@/components/devices/DevicesTable.vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import PageLayout from '@/layouts/PageLayout.vue';

const { t } = useI18n();

const authStore = useAuthStore();
const deviceStore = useDeviceStore();
deviceStore.getDevices();
</script>
