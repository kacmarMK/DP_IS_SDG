<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link to="/devices">
          <p class="main-text text-accent">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            {{ t('device.title', 2) }} >&nbsp;
          </p>
        </router-link>
        <p class="main-text">{{ t('global.add') }}</p>
      </div>
      <create-device-form class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CreateDeviceForm from '@/components/devices/CreateDeviceForm.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
