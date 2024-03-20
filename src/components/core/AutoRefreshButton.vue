<template>
  <q-btn-group unelevated class="shadow">
    <q-btn
      color="primary"
      unelevated
      text-color="white"
      :icon="mdiRefresh"
      no-caps
      :label="t('global.refresh')"
      :loading="loading"
      @click="$emit('onRefresh')"
    />
    <q-btn color="accent" unelevated :icon="mdiCog" @click="refreshDialogOpen = true" />
  </q-btn-group>
  <dialog-common
    v-model="refreshDialogOpen"
    :action-label="t('global.save')"
    @on-submit="
      $emit('onRefresh');
      refreshDialogOpen = false;
    "
  >
    <template #title>{{ t('global.automatic_refresh_interval') }}</template>
    <template #default>
      <q-input
        v-model.number="refreshInterval"
        type="number"
        :min="0"
        :label="t('global.automatic_refresh_interval')"
        :hint="t('global.enter_refresh_interval_s')"
      />
    </template>
  </dialog-common>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { mdiCog, mdiRefresh } from '@quasar/extras/mdi-v6';
import { useI18n } from 'vue-i18n';
import DialogCommon from './DialogCommon.vue';
import { useInterval } from '@/composables/useInterval';

const { t } = useI18n();

const refreshInterval = defineModel({ type: Number, required: true });
const emit = defineEmits(['onRefresh']);
const refreshDialogOpen = ref(false);

const intervalMilliseconds = computed(() => refreshInterval.value * 1000);
useInterval(() => {
  emit('onRefresh');
}, intervalMilliseconds);

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
