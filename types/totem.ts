// /types/totem.ts
export interface Totem {
  _id: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  discoveredByUserId: string;
  imageUrl: string;
  modelUrl?: string;
  createdAt: Date;
}
