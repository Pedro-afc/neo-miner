
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const calculateAutoClickIncrement = (price: number): number => {
  return Math.floor(price * 0.01);
};

export const calculateExperienceRequired = (level: number): number => {
  // Always return 1,000,000 XP required for all levels
  return 1000000;
};

export const calculateLevelFromExperience = (experience: number): number => {
  return Math.floor(experience / 1000000) + 1;
};

export const getExperienceForCurrentLevel = (experience: number): number => {
  const currentLevel = calculateLevelFromExperience(experience);
  return experience - ((currentLevel - 1) * 1000000);
};

// localStorage helper functions
export const saveGameData = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving game data:', error);
  }
};

export const loadGameData = (key: string, defaultValue: any): any => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading game data:', error);
    return defaultValue;
  }
};
