import { defineStore } from 'pinia';
import { Recipe } from '@/models/Recipe';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import recipeService from '@/services/RecipeService';
import { useI18n } from 'vue-i18n';
import { handleError } from '@/utils/error-handler';

export const useRecipeStore = defineStore('recipe', () => {
  const { t } = useI18n();
  const recipes = ref<Recipe[]>([]);
  const isLoadingRecipes = ref(false);
  async function getRecipes() {
    try {
      isLoadingRecipes.value = true;
      recipes.value = await recipeService.getRecipes('none', 'none');
    } catch (error) {
      handleError(error, t('recipe.toasts.load_failed'));
    } finally {
      isLoadingRecipes.value = false;
    }
  }

  return {
    recipes,
    isLoadingRecipes,
    getRecipes,
  };
});
