<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">{{ t('devices') }}</p>
        <q-space></q-space>
        <q-btn
          v-if="authStore.isAdmin"
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          :label="t('add_device')"
          icon="mdi-plus"
          to="/devices/create"
        />
      </div>
      <DevicesTable
        v-model="deviceStore.devices"
        :loading="deviceStore.isLoadingDevices"
        class="shadow"
        @on-change="deviceStore.getDevices"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useDevicesStore } from '@/stores/devices-store';
import DevicesTable from '@/components/devices/DevicesTable.vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';

const { t } = useI18n({ useScope: 'local' });

const authStore = useAuthStore();
const deviceStore = useDevicesStore();
deviceStore.getDevices();
</script>

<i18n lang="json">
{
  "en": {
    "add_device": "Add device"
  },
  "sk": {
    "add_device": "Pridať zariadenie"
  }
}
</i18n>
