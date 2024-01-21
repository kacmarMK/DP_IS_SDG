<template>
  <q-page class="main-padding">
    <div>
      <div class="top-row row items-center">
        <router-link :to="`/devices/${route.params.id.toString()}`">
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <p class="main-text text-accent">{{ t('device.label') }} ></p>
        </router-link>
        <p class="main-text">&nbsp;{{ t('global.edit') }}</p>
      </div>
      <create-device-form
        :is-editing="true"
        :editing-device-id="route.params.id.toString()"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CreateDeviceForm from '@/components/devices/CreateDeviceForm.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
</script>

<style lang="scss" scoped></style>
