import { Device } from './Device';

interface Module {
  uid: string;
  name: string;
  devices?: Array<Device>;
}

interface ModuleInput {
  name: string;
  devices?: Array<Device> | null;
}

export type { Module, ModuleInput };
