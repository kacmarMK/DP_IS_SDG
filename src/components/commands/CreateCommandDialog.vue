<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('command.create_command') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.commandCreate.name" :label="t('global.name')" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          v-model="store.commandCreate.deviceType"
          :label="t('device.device_type')"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          color="secondary"
          :label="t('global.create')"
          no-caps
          :loading="store.isCreatingCommand"
          @click="store.createCommand"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DeviceTypeEnum from '@/models/DeviceType';
import { useCommandsStore } from '@/stores/commands-store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
