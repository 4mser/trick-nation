export interface Spot {
    _id: string;
    name: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
    discoveredByUserId: {
      _id: string;
      username: string;
    };
    createdAt: string;
    imageUrl: string;
  }
  