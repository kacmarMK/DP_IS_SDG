import { Recipe } from 'src/models/Recipe';
import { api } from 'src/boot/ofetch';
import DeviceTypeEnum from 'src/models/DeviceType';

class RecipeService {
  async createRecipe(recipe: Recipe): Promise<Recipe> {
    return await api<Recipe>('jobs/recipe/createRecipe', {
      method: 'POST',
      body: recipe,
    });
  }
  async getRecipes(sortBy: string, sortDirection: string): Promise<Recipe[]> {
    return await api<Recipe[]>(
      `jobs/recipe/getAllRecipes/${sortBy}/${sortDirection}`
    );
  }

  async getFullRecipesByDeviceType(
    deviceType: DeviceTypeEnum
  ): Promise<Recipe[]> {
    return await api<Recipe[]>(
      `/api/jobs/recipe/getFullRecipesByDeviceType/${deviceType}/NONE/NONE`
    );
  }

  // TODO pridat dalsie prepojenia na endpointy
}

export default new RecipeService();
