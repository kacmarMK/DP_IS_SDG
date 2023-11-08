import { Recipe } from 'src/models/Recipe';
import { api } from 'src/boot/ofetch';

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
  // TODO pridat dalsie prepojenia na endpointy
}

export default new RecipeService();
