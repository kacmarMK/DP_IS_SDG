import { defineStore } from 'pinia';
import { Recipe, RecipeFrame } from 'src/models/Recipe';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import recipeService from 'src/services/RecipeService';

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([]);
  const isLoadingRecipes = ref(false);
  async function getRecipes() {
    try {
      isLoadingRecipes.value = true;
      recipes.value = await recipeService.getRecipes('none', 'none');
    } catch (error) {
      console.log(error);
      toast.error('Loading of recipes failed.');
    } finally {
      isLoadingRecipes.value = false;
    }
  }

  const createDialog = ref(false);
  const recipeCreate = ref<RecipeFrame>({
    name: '',
    commands: [],
    subRecipes: [],
    deviceType: undefined,
    subRecipe: false,
    createdAt: 0,
    deactivated: false,
  });

  const isCreatingRecipe = ref(false);
  async function createRecipe() {
    try {
      isCreatingRecipe.value = true;
      await recipeService.createRecipe(recipeCreate.value);
      toast.success('Recipe created.');
      getRecipes();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Recipe creation failed.');
    } finally {
      isCreatingRecipe.value = false;
    }
  }

  return {
    recipes,
    isLoadingRecipes,
    getRecipes,
    createDialog,
    recipeCreate,
    isCreatingRecipe,
    createRecipe,
  };
});
