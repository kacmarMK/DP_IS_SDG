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

  const editDialog = ref(false);
  const isEditingRecipe = ref(false);
  const editingRecipe = ref<RecipeFrame>({
    name: '',
    commands: [],
    subRecipes: [],
    deviceType: undefined,
    subRecipe: false,
    createdAt: 0,
    deactivated: false,
  });
  const editRecipeId = ref<string>();
  async function editRecipe() {
    const editingRecipeId = editRecipeId.value;
    if (!editingRecipeId) {
      return;
    }
    try {
      isEditingRecipe.value = true;
      await recipeService.updateRecipe(editingRecipe.value, editingRecipeId);
      toast.success('Recipe updated!');
      getRecipes();
      editDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Recipe update failed!');
    } finally {
      isEditingRecipe.value = false;
    }
  }

  const deleteDialog = ref(false);
  const isDeletingRecipe = ref(false);
  const deletingRecipe = ref<Recipe>();
  async function deleteRecipe() {
    const deletingRecipeId = deletingRecipe.value?.id;
    if (!deletingRecipeId) {
      return;
    }
    try {
      isDeletingRecipe.value = true;
      await recipeService.deleteRecipeById(deletingRecipeId);
      toast.success('Recipe deleted!');
      getRecipes();
      deleteDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Recipe deletion failed!');
    } finally {
      isDeletingRecipe.value = false;
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
    editDialog,
    isEditingRecipe,
    editingRecipe,
    editRecipeId,
    editRecipe,
    deleteDialog,
    isDeletingRecipe,
    deletingRecipe,
    deleteRecipe,
  };
});
