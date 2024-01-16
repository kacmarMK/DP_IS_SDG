<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Create new recipe</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input v-model="store.recipeCreate.name" label="Name" />
        <!--<q-input label="Commands" v-model="store.recipeCreate.commands" />TODO-->
        <!--<q-input label="SubRecipes" v-model="store.recipeCreate.subRecipes" />TODO-->
        <q-select
          v-model="store.recipeCreate.deviceType"
          label="Device Type"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          v-model="store.recipeCreate.subRecipe"
          class="q-mt-lg"
          dense
          label="Has Subrecipes?"
          color="secondary"
        />
        <q-checkbox
          v-model="store.recipeCreate.deactivated"
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
          label="Create recipe"
          no-caps
          :loading="store.isCreatingRecipe"
          @click="store.createRecipe"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DeviceTypeEnum from '@/models/DeviceType';
import { useRecipesStore } from '@/stores/recipes-store';

const store = useRecipesStore();
store.getRecipes();
</script>

<style lang="scss" scoped></style>
