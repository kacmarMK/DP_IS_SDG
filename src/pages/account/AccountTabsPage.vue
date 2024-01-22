<template>
  <q-page class="main-padding">
    <div>
      <div class="q-mb-md row">
        <p class="main-text">{{ t('account.account_settings') }}</p>
      </div>
    </div>
    <q-card class="shadow q-mb-lg">
      <q-tabs
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-route-tab
          :to="{ path: '/account' }"
          style="min-width: 130px"
          name="account"
          :icon="mdiAccount"
          :label="t('account.label')"
          no-caps
        />
      </q-tabs>
    </q-card>
    <router-view />
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { mdiAccount } from '@quasar/extras/mdi-v6';

const { t } = useI18n();
</script>
<style lang="scss" scoped></style>
