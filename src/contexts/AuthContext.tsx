import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

const AUTH_KEYS = {
  isLoggedIn: 'auth_is_logged_in',
  hasOnboarded: 'auth_has_onboarded',
  phone: 'auth_phone',
  isGuest: 'auth_is_guest',
  name: 'auth_name',
  hasSeenSplash: 'auth_has_seen_splash',
  hasSelectedLanguage: 'auth_has_selected_language',
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean>(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(false);

  const authQuery = useQuery({
    queryKey: ['auth-state'],
    queryFn: async () => {
      const [loggedIn, onboarded, savedPhone, guest, seenSplash, selectedLang] = await Promise.all([
        AsyncStorage.getItem(AUTH_KEYS.isLoggedIn),
        AsyncStorage.getItem(AUTH_KEYS.hasOnboarded),
        AsyncStorage.getItem(AUTH_KEYS.phone),
        AsyncStorage.getItem(AUTH_KEYS.isGuest),
        AsyncStorage.getItem(AUTH_KEYS.hasSeenSplash),
        AsyncStorage.getItem(AUTH_KEYS.hasSelectedLanguage),
      ]);
      const savedName = await AsyncStorage.getItem(AUTH_KEYS.name);
      return {
        isLoggedIn: loggedIn === 'true',
        hasOnboarded: onboarded === 'true',
        phone: savedPhone ?? '',
        isGuest: guest === 'true',
        name: savedName ?? '',
        hasSeenSplash: seenSplash === 'true',
        hasSelectedLanguage: selectedLang === 'true',
      };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (authQuery.data) {
      setIsLoggedIn(authQuery.data.isLoggedIn);
      setHasOnboarded(authQuery.data.hasOnboarded);
      setPhone(authQuery.data.phone);
      setIsGuest(authQuery.data.isGuest);
      setName(authQuery.data.name);
      setHasSeenSplash(authQuery.data.hasSeenSplash);
      setHasSelectedLanguage(authQuery.data.hasSelectedLanguage);
      setIsReady(true);
    }
  }, [authQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      await AsyncStorage.setItem(AUTH_KEYS.isLoggedIn, 'true');
      await AsyncStorage.setItem(AUTH_KEYS.phone, phoneNumber);
      await AsyncStorage.setItem(AUTH_KEYS.isGuest, 'false');
      return phoneNumber;
    },
    onSuccess: (phoneNumber) => {
      setIsLoggedIn(true);
      setPhone(phoneNumber);
      setIsGuest(false);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(AUTH_KEYS.hasOnboarded, 'true');
    },
    onSuccess: () => {
      setHasOnboarded(true);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const enterGuestModeMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(AUTH_KEYS.isGuest, 'true');
      await AsyncStorage.setItem(AUTH_KEYS.hasOnboarded, 'true');
    },
    onSuccess: () => {
      setIsGuest(true);
      setHasOnboarded(true);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const setHasSeenSplashMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(AUTH_KEYS.hasSeenSplash, 'true');
    },
    onSuccess: () => {
      setHasSeenSplash(true);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const setHasSelectedLanguageMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(AUTH_KEYS.hasSelectedLanguage, 'true');
    },
    onSuccess: () => {
      setHasSelectedLanguage(true);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.multiRemove(Object.values(AUTH_KEYS));
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      setHasOnboarded(false);
      setIsGuest(false);
      setPhone('');
      setHasSeenSplash(false);
      setHasSelectedLanguage(false);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const { mutate: loginMutate } = loginMutation;
  const { mutate: completeOnboardingMutate } = completeOnboardingMutation;
  const { mutate: enterGuestModeMutate } = enterGuestModeMutation;
  const { mutate: setHasSeenSplashMutate } = setHasSeenSplashMutation;
  const { mutate: setHasSelectedLanguageMutate, mutateAsync: setHasSelectedLanguageMutateAsync } = setHasSelectedLanguageMutation;

  const updateNameMutation = useMutation({
    mutationFn: async (newName: string) => {
      await AsyncStorage.setItem(AUTH_KEYS.name, newName);
      return newName;
    },
    onSuccess: (newName) => {
      setName(newName);
      queryClient.invalidateQueries({ queryKey: ['auth-state'] });
    },
  });

  const { mutate: logoutMutate } = logoutMutation;
  const { mutate: updateNameMutate } = updateNameMutation;

  const login = useCallback((phoneNumber: string) => {
    loginMutate(phoneNumber);
  }, [loginMutate]);

  const completeOnboarding = useCallback(() => {
    completeOnboardingMutate();
  }, [completeOnboardingMutate]);

  const enterGuestMode = useCallback(() => {
    enterGuestModeMutate();
  }, [enterGuestModeMutate]);

  const confirmSplashSeen = useCallback(() => {
    setHasSeenSplashMutate();
  }, [setHasSeenSplashMutate]);

  const confirmLanguageSelected = useCallback(async () => {
    return await setHasSelectedLanguageMutateAsync();
  }, [setHasSelectedLanguageMutateAsync]);

  const logout = useCallback(() => {
    logoutMutate();
  }, [logoutMutate]);

  const updateName = useCallback((newName: string) => {
    updateNameMutate(newName);
  }, [updateNameMutate]);

  return {
    isReady,
    isLoggedIn,
    hasOnboarded,
    isGuest,
    hasSeenSplash,
    hasSelectedLanguage,
    phone,
    name,
    login,
    updateName,
    completeOnboarding,
    enterGuestMode,
    confirmSplashSeen,
    confirmLanguageSelected,
    logout,
  };
});

