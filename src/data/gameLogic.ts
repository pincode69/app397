import { Fish, FishSize, GameState, RodState } from './types';

const FISH_TYPES = [
  'Icy Fish',
  'Frost Fish',
  'Crystal Fish',
  'Arctic Fish',
  'Glacial Fish',
  'Polar Fish',
  'Ice Fish',
  'Snow Fish',
  'Frozen Fish',
  'Winter Fish',
];

const FISH_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function getRandomFishType(): string {
  return FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
}

export function getFishImageIndex(fishType: string): number {
  const index = FISH_TYPES.indexOf(fishType);
  return FISH_IMAGES[index >= 0 ? index : 0];
}

export function generateFish(): Fish {
  const sizes: FishSize[] = ['small', 'medium', 'large'];
  const size = sizes[Math.floor(Math.random() * sizes.length)];

  const strengthMap = {
    small: 10,
    medium: 20,
    large: 35,
  };

  const fishType = getRandomFishType();

  return {
    id: Date.now().toString(),
    type: fishType,
    size,
    strength: strengthMap[size],
    imageIndex: getFishImageIndex(fishType),
  };
}

export function updateRodState(): RodState {
  const rand = Math.random();

  if (rand < 0.6) return 'idle';
  if (rand < 0.85) return 'light';
  return 'strong';
}

export function startFishing(state: GameState): GameState {
  return {
    ...state,
    isFishing: true,
    startTime: Date.now(),
  };
}

export function onPullPress(state: GameState): GameState {
  if (state.rodState !== 'strong') {
    return state;
  }

  if (!state.currentFish) {
    const fish = generateFish();

    return {
      ...state,
      currentFish: fish,
      pullRequired: fish.strength,
      pullProgress: 0,
    };
  }

  return {
    ...state,
    pullProgress: state.pullProgress + 1,
  };
}

export function checkCatch(state: GameState): GameState {
  if (
    state.currentFish &&
    state.pullProgress >= state.pullRequired
  ) {
    return {
      ...state,
      caughtFish: [...state.caughtFish, state.currentFish],
      currentFish: null,
      pullProgress: 0,
      pullRequired: 0,
    };
  }

  return state;
}

export function stopFishing(state: GameState): GameState {
  const timeSpent =
    state.startTime
      ? Math.floor((Date.now() - state.startTime) / 1000)
      : 0;

  return {
    ...state,
    isFishing: false,
    startTime: null,
    totalFishingTime: state.totalFishingTime + timeSpent,
    currentFish: null,
    pullProgress: 0,
    pullRequired: 0,
  };
}

export function getInitialGameState(): GameState {
  return {
    isFishing: false,
    rodState: 'idle',
    currentFish: null,
    pullProgress: 0,
    pullRequired: 0,
    startTime: null,
    totalFishingTime: 0,
    caughtFish: [],
  };
}
