import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileApi, API_ENDPOINTS } from '@/services/api';

export const useProfile = () => {
  const profileQ = useQuery({
    queryKey: [API_ENDPOINTS.profile],
    queryFn: profileApi.getProfile,
  });

  const [available, setAvailable] = useState(true);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [lockScreenAlerts, setLockScreenAlerts] = useState(true);
  const [hapticSound, setHapticSound] = useState(true);

  const toggleAvailable = useCallback(() => setAvailable((v) => !v), []);
  const toggleEmergency = useCallback(() => setEmergencyOnly((v) => !v), []);

  return {
    profile: profileQ.data,
    available,
    emergencyOnly,
    lockScreenAlerts,
    hapticSound,
    toggleAvailable,
    toggleEmergency,
    setLockScreenAlerts,
    setHapticSound,
    isLoading: profileQ.isLoading,
  };
};