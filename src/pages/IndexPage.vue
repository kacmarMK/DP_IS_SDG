<template>
  <q-page class="row items-center justify-evenly">{{ t('Hello') }}</q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
</script>

<i18n lang="json">
{
  "en": {
    "Hello": "Hello"
  },
  "sk": {
    "Hello": "Ahoj"
  }
}
</i18n>
