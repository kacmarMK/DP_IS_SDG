<template>
  <q-dialog v-model="store.createDialog">
    <q-card style="min-width: 350px" class="q-pa-">
      <q-card-section>
        <div class="text-h6">Create new recipe</div>
      </q-card-section>

      <q-card-section class="q-pt-none column q-gutter-md">
        <q-input label="Name" v-model="store.recipeCreate.name" />
        <!--<q-input label="Commands" v-model="store.recipeCreate.commands" />TODO-->
        <!--<q-input label="SubRecipes" v-model="store.recipeCreate.subRecipes" />TODO-->
        <q-select
          label="Device Type"
          v-model="store.recipeCreate.deviceType"
          :options="Object.values(DeviceTypeEnum)"
        >
        </q-select>
        <q-checkbox
          class="q-mt-lg"
          v-model="store.recipeCreate.subRecipe"
          dense
          label="Has Subrecipes?"
          color="secondary"
        />
        <q-checkbox
          class="q-mt-lg"
          v-model="store.recipeCreate.deactivated"
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
          label="Create recipe"
          no-caps
          @click="store.createRecipe"
          :loading="store.isCreatingRecipe"
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
