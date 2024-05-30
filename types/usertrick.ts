import { Trick } from './tricks';

export interface UserTrick {
  _id: string;
  userId: string;
  trickId: Trick;
  videoUrl: string;
  unlockedAt: Date;
}
