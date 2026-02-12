export type FishSize = 'small' | 'medium' | 'large';

export type RodState = 'idle' | 'light' | 'strong';

export type Fish = {
  id: string;
  type: string;
  size: FishSize;
  strength: number;
  imageIndex: number;
};

export type GameState = {
  isFishing: boolean;
  rodState: RodState;
  currentFish: Fish | null;

  pullProgress: number;
  pullRequired: number;

  startTime: number | null;
  totalFishingTime: number;

  caughtFish: Fish[];
};

export type CaughtFishStats = {
  type: string;
  size: FishSize;
  count: number;
};
