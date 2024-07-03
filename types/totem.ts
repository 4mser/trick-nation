// /types/totem.ts
export interface Totem {
    _id: string;
    name: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
    discoveredByUserId: string;
    modelUrl: string;
    textureUrl?: string;
    createdAt: Date;
  }
  