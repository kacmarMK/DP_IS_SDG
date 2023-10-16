import DeviceTypeEnum from './DeviceType';

interface Command {
  id: string;
  name: string;
  params?: Array<number>;
  deviceType?: DeviceTypeEnum;
  createdAt?: number;
  deactivated?: boolean;
}

export type { Command };
