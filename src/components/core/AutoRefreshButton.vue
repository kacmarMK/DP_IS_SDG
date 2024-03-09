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
        :min="1"
        :label="t('global.automatic_refresh_interval')"
        :hint="t('global.enter_refresh_interval_s')"
      />
    </template>
  </dialog-common>
</template>

<script setup lang="ts">
import { mdiCog, mdiRefresh } from '@quasar/extras/mdi-v6';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import DialogCommon from './DialogCommon.vue';

const { t } = useI18n();

const refreshInterval = defineModel({ type: Number, required: true });

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onRefresh']);

const refreshDialogOpen = ref(false);
let intervalId: NodeJS.Timeout | null = null;

const setupAutoRefresh = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (refreshInterval.value != null && refreshInterval.value >= 1) {
    intervalId = setInterval(() => {
      emit('onRefresh');
    }, refreshInterval.value * 1000);
  }
};

watch(refreshInterval, () => {
  setupAutoRefresh();
});

onMounted(() => {
  setupAutoRefresh();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
