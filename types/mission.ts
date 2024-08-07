export interface Species {
  _id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
}

export interface Sighting {
  _id: string;
  species: string;
  imageUrl: string;
  date: string;
}


export interface Mission {
  _id: string;
  name: string;
  type: string;
  difficulty: string;
  imageUrl: string;
  startDate?: Date;
  endDate?: Date;
  species: Species[];
  participants: string[];
  description: string;
  rewards: string[]
}
