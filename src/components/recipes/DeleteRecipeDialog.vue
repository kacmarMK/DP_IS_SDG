<template>
  <q-dialog v-model="store.deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Recipe</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to delete this recipe?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-9" label="Cancel" v-close-popup no-caps />
        <q-btn
          unelevated
          label="Delete"
          color="red"
          :loading="store.isDeletingRecipe"
          no-caps
          @click="store.deleteRecipe()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useRecipesStore } from '../../stores/recipes-store';

const store = useRecipesStore();
store.getRecipes();
</script>

<style lang="scss" scoped></style>
