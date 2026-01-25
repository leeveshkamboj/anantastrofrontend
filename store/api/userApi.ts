import { baseApi } from './baseApi';
import { useGetProfileQuery } from './authApi';
import { useUpdateUserMutation } from './adminApi';

export interface UpdateUserSettingsRequest {
  currency?: string;
  timezone?: string;
}

export interface UpdateUserSettingsResponse {
  isSuccess: boolean;
  data: {
    message: string;
  };
}

// Re-export updateUser from adminApi for regular users
export { useUpdateUserMutation };

// Hook to update user settings (currency/timezone)
export function useUpdateUserSettings() {
  const { data: userData } = useGetProfileQuery();
  const [updateUser] = useUpdateUserMutation();

  return {
    updateSettings: async (settings: UpdateUserSettingsRequest) => {
      if (!userData?.data) {
        throw new Error('User not found');
      }
      const result = await updateUser({
        id: userData.data.id,
        data: settings,
      }).unwrap();
      return result;
    },
  };
}
