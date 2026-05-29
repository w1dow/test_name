import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  // Try OAuth first, then local auth
  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localAuthData,
    isLoading: localLoading,
  } = trpc.localAuth.verify.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !oauthUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  const user = oauthUser || localAuthData?.user || null;
  const isLoading = oauthLoading || (localLoading && !oauthUser);

  return useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading: isLoading || logoutMutation.isPending,
      logout,
      refresh: () => utils.invalidate(),
    }),
    [user, isLoading, logoutMutation.isPending, logout, utils],
  );
}
