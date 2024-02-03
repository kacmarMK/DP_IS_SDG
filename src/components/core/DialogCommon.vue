<template>
  <q-dialog v-model="isDialogOpen">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">
          <slot name="title" />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none column q-gutter-md">
        <slot />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn unelevated color="primary" :label="actionLabel" no-caps :loading="loading" @click="emit('onSubmit')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const isDialogOpen = defineModel<boolean>();
defineProps({
  actionLabel: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(['onSubmit']);

const { t } = useI18n();
</script>
