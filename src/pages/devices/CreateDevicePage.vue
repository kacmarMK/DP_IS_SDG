<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link to="/devices">
          <p class="main-text text-accent">{{ t('devices') }} >&nbsp;</p>
        </router-link>
        <p class="main-text">{{ t('add') }}</p>
      </div>
      <create-device-form class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CreateDeviceForm from '@/components/devices/CreateDeviceForm.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>

<style lang="scss" scoped></style>

<i18n lang="json">
{
  "en": {
    "add": "Add"
  },
  "sk": {
    "add": "Pridať"
  }
}
</i18n>
