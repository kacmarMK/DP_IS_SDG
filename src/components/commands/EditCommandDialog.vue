<template>
  <q-dialog v-model="store.editDialog">
    <q-card style="min-width: 350px" class="q-pa-xs">
      <q-card-section>
        <div class="text-h6">{{ t('command.edit_command') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.editedCommand.name" :label="t('global.name')" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          v-model="store.editedCommand.deviceType"
          :label="t('device.device_type')"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat :label="t('global.cancel')" no-caps />
        <q-btn
          unelevated
          style="background: #164924; color: white"
          :label="t('global.save')"
          no-caps
          :loading="store.isEditingCommand"
          @click="store.editCommand"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DeviceTypeEnum from 'src/models/DeviceType';
import { useCommandsStore } from '../../stores/commands-store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
