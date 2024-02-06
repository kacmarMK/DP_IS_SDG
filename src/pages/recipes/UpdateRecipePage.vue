<template>
  <PageLayout :title="t('global.edit')" :previous-title="t('recipe.label', 2)" previous-route="/recipes">
    <template #actions>
      <q-btn
        unelevated
        color="primary"
        :label="t('global.save')"
        padding="7px 35px"
        no-caps
        type="submit"
        :loading="updatingRecipe"
        @click="updateRecipe"
      />
    </template>
    <RecipeForm v-if="recipe.data" v-model="recipe.data" />
  </PageLayout>
</template>

<script setup lang="ts">
import RecipeForm from '@/components/recipes/RecipeForm.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RecipeService from '@/services/RecipeService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useAsyncData } from '@/composables/useAsyncData';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const recipe = reactive(
  useAsyncData(() => RecipeService.getRecipeById(route.params.id.toString()), t('recipe.toasts.load_failed')),
);

const updatingRecipe = ref(false);
async function updateRecipe() {
  if (!recipe.data) return;
  try {
    updatingRecipe.value = true;
    await RecipeService.updateRecipe(recipe.data, recipe.data.id);
    toast.success(t('recipe.toasts.update_success'));
  } catch (error) {
    handleError(error, t('recipe.toasts.update_failed'));
  } finally {
    updatingRecipe.value = false;
  }
}
</script>
