import { api } from 'src/boot/ofetch';
import { Collection, CollectionInput } from '@/models/Collection';

class CollectionService {
  async getCollections(): Promise<Collection[]> {
    let collections = await api<Collection[]>('collection');

    // Filter out null modules
    collections = collections.map((collection) => {
      if (collection.modules) {
        collection.modules = collection.modules.filter(
          (module) => module !== null,
        );
      }
      return collection;
    });

    return collections;
  }

  async getCollection(uid: string): Promise<Collection> {
    const collection = await api<Collection>(`collection/${uid}`);

    if (collection.modules) {
      collection.modules = collection.modules.filter(
        (module) => module !== null,
      );
    }

    return collection;
  }

  async createCollection(collection: CollectionInput): Promise<Collection> {
    return await api<Collection>('collection/create', {
      method: 'POST',
      body: collection,
    });
  }

  async updateCollection(
    uid: string,
    collection: CollectionInput,
  ): Promise<Collection> {
    return await api<Collection>(`collection/update/${uid}`, {
      method: 'PUT',
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
