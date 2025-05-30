
import { saveGameData, loadGameData } from './gameUtils';

export interface OfflineEarnings {
  coins: number;
  experience: number;
  timeOffline: number;
}

export const calculateOfflineEarnings = (): OfflineEarnings => {
  const lastActiveTime = loadGameData('lastActiveTime', Date.now());
  const autoClickPower = loadGameData('autoClickPower', 0);
  const currentTime = Date.now();
  
  const timeOffline = Math.max(0, currentTime - lastActiveTime);
  const secondsOffline = Math.floor(timeOffline / 1000);
  
  // Cap offline time to 8 hours maximum
  const cappedSeconds = Math.min(secondsOffline, 8 * 60 * 60);
  
  const offlineCoins = autoClickPower * cappedSeconds;
  const offlineExperience = cappedSeconds;
  
  return {
    coins: offlineCoins,
    experience: offlineExperience,
    timeOffline: cappedSeconds * 1000
  };
};

export const updateLastActiveTime = () => {
  saveGameData('lastActiveTime', Date.now());
};

export const formatOfflineTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};
