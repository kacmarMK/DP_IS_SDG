import { defineStore } from 'pinia';
import { Recipe } from 'src/models/Recipe';
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
  /*const commandCreate = ref<CommandFrame>({
    name: '',
    params: [], // TODO
    deviceType: undefined,
    createdAt: 0,
    deactivated: false,
  });
  const isCreatingCommand = ref(false);
  async function createCommand() {
    try {
      isCreatingCommand.value = true;
      await commandService.createCommand(commandCreate.value);
      toast.success('Command created.');
      getCommands();
      createDialog.value = false;
    } catch (error) {
      console.log(error);
      toast.error('Device creation failed.');
    } finally {
      isCreatingCommand.value = false;
    }
  }*/

  return {
    recipes,
    isLoadingRecipes,
    getRecipes,
    createDialog /*,
    commandCreate,
    isCreatingCommand,
    createCommand,*/,
  };
});
