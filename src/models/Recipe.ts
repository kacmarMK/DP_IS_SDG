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

interface RecipeFrame {
  name: string;
  commands?: Array<Command>;
  subRecipes?: Array<Recipe>;
  deviceType?: DeviceTypeEnum;
  subRecipe: boolean;
  createdAt?: number;
  deactivated?: boolean;
}

export type { Recipe, RecipeFrame };
