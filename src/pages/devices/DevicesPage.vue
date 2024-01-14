<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">{{ t('devices') }}</p>
        <q-space></q-space>
        <q-btn
          class="shadow"
          color="primary"
          unelevated
          no-caps
          size="15px"
          :label="t('create_device')"
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });

const store = useDevicesStore();
store.getDevices();
</script>

<i18n lang="json">
{
  "en": {
    "create_device": "Add device"
  },
  "sk": {
    "create_device": "Pridať zariadenie"
  }
}
</i18n>
