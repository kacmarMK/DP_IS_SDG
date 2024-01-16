<template>
  <q-dialog v-model="store.deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Command</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to delete this command?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
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
import { useCommandsStore } from '../../stores/commands-store';

const store = useCommandsStore();
store.getCommands();
</script>

<style lang="scss" scoped></style>
