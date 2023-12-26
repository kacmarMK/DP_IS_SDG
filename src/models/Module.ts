import { Device } from './Device';

interface Module {
  uid: string;
  name: string;
  devices?: Array<Device>;
}

interface ModuleInput {
  name: string;
}

export type { Module, ModuleInput };
