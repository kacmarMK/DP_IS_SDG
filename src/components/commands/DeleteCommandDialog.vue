<template>
  <q-dialog v-model="store.deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('command.delete_command') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ t('command.delete_command_desc') }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          color="grey-9"
          :label="t('global.cancel')"
          no-caps
        />
        <q-btn
          unelevated
          :label="t('global.delete')"
          color="red"
          :loading="store.isDeletingCommand"
          no-caps
          @click="store.deleteCommand()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCommandsStore } from '../../stores/commands-store';

const { t } = useI18n();
const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
