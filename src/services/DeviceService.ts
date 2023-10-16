import { Device, DeviceCreate } from 'src/models/Device';
import { api } from 'src/boot/ofetch';

class DeviceService {
  async getDevices(): Promise<Device[]> {
    return await api<Device[]>('device');
  }

  async getDevice(uid: string): Promise<Device> {
    return await api<Device>(`device/getDeviceById/${uid}`);
  }

  async createDevice(deviceCreate: DeviceCreate): Promise<Device> {
    return await api<Device>('device/create', {
      method: 'POST',
      body: deviceCreate,
    });
  }

  async deleteDevice(uid: string): Promise<void> {
    await api(`device/delete/${uid}`, {
      method: 'DELETE',
    });
  }
}

export default new DeviceService();
