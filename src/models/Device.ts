import { DataPointTag } from './DataPointTag';
import DeviceTypeEnum from './DeviceType';
import { Job } from './Job';

interface Device {
  uid: string;
  name: string;
  mac: string;
  type: DeviceTypeEnum;
  version: string;
  firmware: string;
  dataPointTags: DataPointTag[];
  responseTime: number;
  addTime?: number;
  initExpireTime?: number;
  initApiKey?: string;
  deactivated: boolean;
  jobs: Job[];
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
