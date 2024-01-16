<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Create new command</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.commandCreate.name" label="Name" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          v-model="store.commandCreate.deviceType"
          label="Device Type"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          v-model="store.commandCreate.deactivated"
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
          color="secondary"
          label="Create command"
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

const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
