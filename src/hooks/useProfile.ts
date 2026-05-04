import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileApi, API_ENDPOINTS } from '@/services/api';
import { mockDoctorProfile } from '@/mocks/mockData';

export const useProfile = () => {
  const profileQ = useQuery({
    queryKey: [API_ENDPOINTS.profile],
    queryFn: profileApi.getProfile,
  });

  const profile = profileQ.data ?? mockDoctorProfile;

  const [available, setAvailable] = useState(profile.available);
  const [emergencyOnly, setEmergencyOnly] = useState(profile.emergencyOnly);
  const [lockScreenAlerts, setLockScreenAlerts] = useState(true);
  const [hapticSound, setHapticSound] = useState(true);

  const toggleAvailable = useCallback(() => setAvailable((v) => !v), []);
  const toggleEmergency = useCallback(() => setEmergencyOnly((v) => !v), []);

  return {
    profile,
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
