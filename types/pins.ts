export interface Pin {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  discoveredByUserId: {
    _id: string;
    username: string;
    profilePictureUrl: string;
  };
  createdAt: string;
  imageUrl: string;
}
