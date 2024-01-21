<template>
  <q-dialog v-model="store.deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('recipe.delete_recipe') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ t('recipe.delete_recipe_desc') }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          color="grey-9"
          :label="t('global.cancel')"
          no-caps
        />
        <q-btn
          unelevated
          :label="t('global.delete')"
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
import { useI18n } from 'vue-i18n';
import { useRecipesStore } from '../../stores/recipes-store';

const { t } = useI18n();
const store = useRecipesStore();
store.getRecipes();
</script>

<style lang="scss" scoped></style>
