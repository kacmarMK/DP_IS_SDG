<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
      <div style="font-size: 30vh">404</div>
      <div class="text-h2" style="opacity: 0.4">{{ t('oops') }}</div>
      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="t('go_home')"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>

<i18n lang="json">
{
  "en": {
    "oops": "Oops. Nothing here...",
    "go_home": "Go Home"
  },
  "sk": {
    "oops": "Ups. Nič tu nie je...",
    "go_home": "Ísť domov"
  }
}
</i18n>
