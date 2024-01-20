<template>
  <q-page class="row items-center justify-evenly">{{
    t('global.hello')
  }}</q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
