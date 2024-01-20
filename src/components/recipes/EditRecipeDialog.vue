<template>
  <q-dialog v-model="store.editDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Edit recipe</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.editingRecipe.name" label="Name" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          v-model="store.editingRecipe.deviceType"
          label="Device Type"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          v-model="store.editingRecipe.deactivated"
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
          :loading="store.isEditingRecipe"
          @click="store.editRecipe"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DeviceTypeEnum from 'src/models/DeviceType';
import { useRecipesStore } from '../../stores/recipes-store';

const store = useRecipesStore();
store.getRecipes();
</script>

<style lang="scss" scoped></style>
