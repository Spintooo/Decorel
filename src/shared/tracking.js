// shared/tracking.js - Système de tracking synchronisé

// Clés de stockage
const SESSION_KEY = 'fb_tracking_session';
const DEVICE_KEY = 'fb_device_id';
const CHANNEL_STATS_KEY = 'channel_preference_stats';

// Génère un ID unique
const generateId = (prefix) => {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Initialise une session de tracking unique partagée
export const initTrackingSession = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateId('session');
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

// Génère un device ID persistant dans localStorage
export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_KEY);
  
  if (!deviceId) {
    deviceId = generateId('device');
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  
  return deviceId;
};

// Récupère la session courante
export const getCurrentSession = () => {
  return sessionStorage.getItem(SESSION_KEY);
};

// KPI 9: Tracker la préférence de canal
export const trackChannelPreference = (channel) => {
  try {
    const stats = JSON.parse(localStorage.getItem(CHANNEL_STATS_KEY) || '{"whatsapp": 0, "site": 0}');
    
    if (channel === 'whatsapp' || channel === 'site') {
      stats[channel] = (stats[channel] || 0) + 1;
      localStorage.setItem(CHANNEL_STATS_KEY, JSON.stringify(stats));
      
      // Calculer le ratio pour KPI 9
      const total = stats.whatsapp + stats.site;
      const whatsappRatio = total > 0 ? (stats.whatsapp / total * 100) : 0;
      const siteRatio = total > 0 ? (stats.site / total * 100) : 0;
      
      return {
        channel_chosen: channel,
        whatsapp_count: stats.whatsapp,
        site_count: stats.site,
        total_choices: total,
        whatsapp_ratio: whatsappRatio,
        site_ratio: siteRatio,
        preference: whatsappRatio > siteRatio ? 'whatsapp' : 'site'
      };
    }
  } catch (error) {
    console.warn('Erreur tracking préférence canal:', error);
  }
  
  return null;
};

// Réinitialise les stats de canal (optionnel)
export const resetChannelStats = () => {
  localStorage.removeItem(CHANNEL_STATS_KEY);
};

// Obtient les stats actuelles de canal
export const getChannelStats = () => {
  try {
    return JSON.parse(localStorage.getItem(CHANNEL_STATS_KEY) || '{"whatsapp": 0, "site": 0}');
  } catch {
    return { whatsapp: 0, site: 0 };
  }
};