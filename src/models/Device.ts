import DeviceTypeEnum from './DeviceType';

interface Device {
  uid: string;
  name: string;
  mac: string;
  type: DeviceTypeEnum;
  version: string;
  firmware: string;
  responseTime: number;
  addTime?: number;
  initExpireTime?: number;
  initApiKey?: string;
  deactivated: boolean;
}

interface DeviceCreate {
  name: string;
  mac: string;
  type?: DeviceTypeEnum;
  version: string;
  firmware: string;
  initApiKey?: string;
  deactivated: boolean;
}

export type { Device, DeviceCreate };
