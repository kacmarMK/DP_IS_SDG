import { Device, DeviceCreate } from 'src/models/Device';
import { api } from 'src/boot/ofetch';

class DeviceService {
  async getDevices(): Promise<Device[]> {
    const devices: Device[] = await api<Device[]>('device');
    return devices;
  }

  async createDevice(deviceCreate: DeviceCreate): Promise<Device> {
    const device: Device = await api<Device>('device/create', {
      method: 'POST',
      body: deviceCreate,
    });
    return device;
  }

  async deleteDevice(uid: string): Promise<void> {
    await api(`device/delete/${uid}`, {
      method: 'DELETE',
    });
  }
}

export default new DeviceService();
