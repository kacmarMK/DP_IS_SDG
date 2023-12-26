import { api } from 'src/boot/ofetch';
import { Module, ModuleInput } from '@/models/Module';

class ModuleService {
  async createModule(module: ModuleInput): Promise<Module> {
    return await api<Module>('module/create', {
      method: 'POST',
      body: module,
    });
  }

  async deleteModule(uid: string): Promise<Module> {
    return await api<Module>(`module/delete/${uid}`, {
      method: 'DELETE',
    });
  }

  async addModuleToCollection(
    collectionId: string,
    moduleId: string,
  ): Promise<Module> {
    return await api<Module>(
      `collection/addModule/${collectionId}/${moduleId}`,
      {
        method: 'PUT',
      },
    );
  }
}

export default new ModuleService();
