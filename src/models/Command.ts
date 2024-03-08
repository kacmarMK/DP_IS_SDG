import DeviceTypeEnum from './DeviceType';

interface Command {
  id: string;
  name: string;
  params?: Array<string>;
  recipe: boolean;
  subCommands?: Array<Command>;
  deviceType?: DeviceTypeEnum;
  createdAt?: number;
  deactivated?: boolean;
}

interface CommandInput {
  name: string;
  params?: Array<string>;
  recipe: boolean;
  subCommands?: Array<Command>;
  deviceType?: DeviceTypeEnum;
  createdAt?: number;
  deactivated?: boolean;
}

function getEmptyCommandInputAsRecipe(): CommandInput {
  return {
    name: '',
    recipe: true,
    subCommands: [],
  };
}

export type { Command, CommandInput };
export { getEmptyCommandInputAsRecipe };
