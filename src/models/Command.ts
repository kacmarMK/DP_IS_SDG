import DeviceTypeEnum from './DeviceType';

interface Command {
  id: string;
  name: string;
  params?: Array<string>;
  deviceType?: DeviceTypeEnum;
  createdAt?: number;
  deactivated?: boolean;
}

interface CommandFrame {
  name: string;
  params?: Array<string>;
  deviceType?: DeviceTypeEnum;
  createdAt?: number;
  deactivated?: boolean;
}

export type { Command, CommandFrame };
