import DeviceTypeEnum from './DeviceType';
import { Command } from './Command';

interface Recipe {
  id: string;
  name: string;
  commands?: Array<Command>;
  subRecipes?: Array<Recipe>;
  deviceType?: DeviceTypeEnum;
  hasSubRecipes: boolean;
  createdAt?: number;
  deactivated?: boolean;
}

interface RecipeInput {
  name: string;
  commands: Array<Command>;
  subRecipes?: Array<Recipe>;
  deviceType?: DeviceTypeEnum;
  subRecipe: boolean;
}

function getEmptyRecipeInput(): RecipeInput {
  return {
    name: '',
    subRecipe: false,
    commands: [],
  };
}

export type { Recipe, RecipeInput };
export { getEmptyRecipeInput };
