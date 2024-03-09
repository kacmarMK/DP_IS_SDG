import { DataPointTag } from './DataPointTag';
import DeviceTypeEnum from './DeviceType';
import { Job } from './Job';
import { JobStatusEnum } from './JobStatusEnum';
import { User } from './User';

enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

interface Device {
  uid: string;
  user: User;
  sharedUsers: User[];
  name: string;
  mac: string;
  type: DeviceTypeEnum;
  version: string;
  firmware: string;
  dataPointTags: DataPointTag[];
  responseTime: number;
  addTime?: number;
  lastContact?: string;
  lastJobStatus?: JobStatusEnum;
  initExpireTime?: number;
  initApiKey?: string;
  deactivated: boolean;
  jobs: Job[];
}

interface DeviceInput {
  name: string;
  mac: string;
  type?: DeviceTypeEnum;
  version: string;
  firmware: string;
  responseTime?: number;
  initApiKey?: string;
  deactivated: boolean;
  dataPointTags?: DataPointTag[] | null;
}

function deviceToInput(device: Device): DeviceInput {
  return {
    name: device.name,
    mac: device.mac,
    type: device.type,
    version: device.version,
    firmware: device.firmware,
    responseTime: device.responseTime,
    initApiKey: device.initApiKey,
    deactivated: device.deactivated,
    dataPointTags: device.dataPointTags,
  };
}

function getEmptyDeviceInput(): DeviceInput {
  return {
    name: '',
    mac: '',
    version: '',
    firmware: '',
    responseTime: 10,
    deactivated: false,
  };
}

//Online or offline
function getDeviceStatus(device: Device, timeReserveMs = 1000): DeviceStatus {
  if (!device.lastContact) {
    return DeviceStatus.OFFLINE;
  }

  const lastContactDate = new Date(device.lastContact + 'Z');

  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - lastContactDate.getTime();
  const responseTimeMs = device.responseTime * 1000 + timeReserveMs;

  if (timeDifference <= responseTimeMs) {
    return DeviceStatus.ONLINE;
  } else {
    return DeviceStatus.OFFLINE;
  }
}

export type { Device, DeviceInput };
export { deviceToInput, getEmptyDeviceInput, getDeviceStatus, DeviceStatus };
