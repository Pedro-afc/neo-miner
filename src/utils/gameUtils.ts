
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return num.toString();
};

export const calculateAutoClickIncrement = (cardPrice: number): number => {
  const increment = cardPrice * 0.01;
  return Math.ceil(increment);
};

export const saveGameData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadGameData = (key: string, defaultValue: any = null) => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  
  try {
    return JSON.parse(saved);
  } catch (error) {
    // If parsing fails, return the raw string (for backwards compatibility with plain string dates)
    console.warn(`Failed to parse JSON for key "${key}": ${error}. Using raw value.`);
    return saved;
  }
};
