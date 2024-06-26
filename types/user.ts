export interface User {
  _id: string;
  username: string;
  email: string;
  level: number;
  description?: string;
  experiencePoints: number;
  skateCoinsBalance: number;
  city?: string;
  country?: string;
  profilePictureUrl?: string;
  roles:string[];
  nucleus:string;
  currentCrewId?: string;
  unlockedTricks?: { _id: string; name: string }[]; // Agregar los trucos desbloqueados
  onboardingCompleted: boolean;
}
