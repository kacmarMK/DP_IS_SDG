import { api } from 'src/boot/ofetch';
import { Collection, CollectionInput } from '@/models/Collection';

class CollectionService {
  async getCollections(): Promise<Collection[]> {
    return await api<Collection[]>('collection');
  }

  async getCollection(uid: string): Promise<Collection> {
    return await api<Collection>(`collection/${uid}`);
  }

  async createCollection(collection: CollectionInput): Promise<Collection> {
    return await api<Collection>('collection/create', {
      method: 'POST',
      body: collection,
    });
  }

  async deleteCollection(uid: string): Promise<Collection> {
    return await api<Collection>(`collection/delete/${uid}`, {
      method: 'DELETE',
    });
  }
}

export default new CollectionService();
