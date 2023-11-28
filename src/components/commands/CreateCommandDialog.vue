<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Create new command</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input label="Name" v-model="store.commandCreate.name" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          label="Device Type"
          v-model="store.commandCreate.deviceType"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          class="q-mt-lg"
          v-model="store.commandCreate.deactivated"
          dense
          label="Deactivated"
          color="secondary"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          color="secondary"
          label="Create command"
          no-caps
          @click="store.createCommand"
          :loading="store.isCreatingCommand"
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
