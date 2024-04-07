import { api } from '@/utils/api';
import { Module, ModuleInput } from '@/models/Module';

class ModuleService {
  async createModule(module: ModuleInput): Promise<Module> {
    return await api<Module>('module/create', {
      method: 'POST',
      body: module,
    });
  }

  async getModule(uid: string): Promise<Module> {
    const module = await api<Module>(`module/${uid}`);

    if (module.devices) {
      module.devices = module.devices.filter((device) => device !== null && device.deactivated === false);

      module.devices = module.devices.map((device) => {
        if (device.dataPointTags) {
          device.dataPointTags = device.dataPointTags.filter((tag) => tag !== null && tag.deactivated === false);
        }
        return device;
      });
    }

    return module;
  }

  async deleteModule(uid: string): Promise<Module> {
    return await api<Module>(`module/delete/${uid}`, {
      method: 'DELETE',
    });
  }

  async addModuleToCollection(collectionId: string, moduleId: string): Promise<Module> {
    return await api<Module>(`collection/addModule/${collectionId}/${moduleId}`, {
      method: 'PUT',
    });
  }

  async updateModule(uid: string, module: ModuleInput): Promise<Module> {
    module.devices = null;
    return await api<Module>(`module/update/${uid}`, {
      method: 'PUT',
      body: module,
    });
  }

  async removeModuleFromCollection(collectionId: string, moduleId: string): Promise<Module> {
    return await api<Module>(`collection/removeModule/${collectionId}/${moduleId}`, {
      method: 'DELETE',
    });
  }

  async addDeviceToModule(moduleId: string, deviceId: string): Promise<Module> {
    return await api<Module>(`module/addDevice/${moduleId}/${deviceId}`, {
      method: 'PUT',
    });
  }

  async removeDeviceFromModule(moduleId: string, deviceId: string): Promise<Module> {
    return await api<Module>(`module/removeDevice/${moduleId}/${deviceId}`, {
      method: 'DELETE',
    });
  }
}

export default new ModuleService();
