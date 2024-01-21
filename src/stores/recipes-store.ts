import { defineStore } from 'pinia';
import { Recipe, RecipeFrame } from '@/models/Recipe';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import recipeService from '@/services/RecipeService';
import { useI18n } from 'vue-i18n';

export const useRecipesStore = defineStore('recipes', () => {
  const { t } = useI18n();
  const recipes = ref<Recipe[]>([]);
  const isLoadingRecipes = ref(false);
  async function getRecipes() {
    try {
      isLoadingRecipes.value = true;
      recipes.value = await recipeService.getRecipes('none', 'none');
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.load_failed'));
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
      toast.success(t('recipe.toasts.create_success'));
      getRecipes();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.create_failed'));
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
      toast.success(t('recipe.toasts.update_success'));
      getRecipes();
      editDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.update_failed'));
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
      toast.success(t('recipe.toasts.delete_success'));
      getRecipes();
      deleteDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.delete_failed'));
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
