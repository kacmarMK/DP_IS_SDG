import DeviceTypeEnum from './DeviceType';

interface Command {
  id: string;
  name: string;
  params?: Array<number>;
  deviceType?: DeviceTypeEnum;
  createdAt?: string;
  deactivated?: boolean;
}

export type { Command };
