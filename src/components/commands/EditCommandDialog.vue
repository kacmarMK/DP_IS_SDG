<template>
  <q-dialog v-model="store.editDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Edit command</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.editingCommand.name" label="Name" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          v-model="store.editingCommand.deviceType"
          label="Device Type"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          v-model="store.editingCommand.deactivated"
          class="q-mt-lg"
          dense
          label="Deactivated"
          color="secondary"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn v-close-popup flat label="Cancel" no-caps />
        <q-btn
          unelevated
          style="background: #164924; color: white"
          label="Save"
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

const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
