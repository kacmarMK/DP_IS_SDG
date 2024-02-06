<template>
  <PageLayout :title="t('global.create')" :previous-title="t('recipe.label', 2)" previous-route="/recipes">
    <template #actions>
      <q-btn unelevated color="primary" :label="t('global.save')" padding="7px 35px" no-caps type="submit" />
    </template>
    <RecipeForm v-model="recipe" />
  </PageLayout>
</template>

<script setup lang="ts">
import RecipeForm from '@/components/recipes/RecipeForm.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { RecipeInput, getEmptyRecipeInput } from '@/models/Recipe';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const recipe = ref<RecipeInput>(getEmptyRecipeInput());
</script>
