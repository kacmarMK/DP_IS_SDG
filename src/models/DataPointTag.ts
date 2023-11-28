import { StoredData } from './StoredData';

interface DataPointTag {
  uid: string;
  tag: string;
  name: string;
  unit: string;
  decimal: number;
  storedData: StoredData[];
  createdAt: number;
  deactivated: boolean;
}

interface DataPointTagInput {
  tag: string;
  name: string;
  unit: string;
  decimal: number;
}

export type { DataPointTag, DataPointTagInput };
