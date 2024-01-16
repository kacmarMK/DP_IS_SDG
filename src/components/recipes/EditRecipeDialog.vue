<template>
  <q-dialog v-model="store.editDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Edit recipe</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input label="Name" v-model="store.editingRecipe.name" />
        <!--<q-input label="Parameters" v-model="store.commandCreate.params" />TODO-->
        <q-select
          label="Device Type"
          v-model="store.editingRecipe.deviceType"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          class="q-mt-lg"
          v-model="store.editingRecipe.deactivated"
          dense
          label="Deactivated"
          color="secondary"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          style="background: #164924; color: white"
          label="Save"
          no-caps
          @click="store.editRecipe"
          :loading="store.isEditingRecipe"
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
