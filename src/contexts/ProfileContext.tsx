import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Profile = {
  name: string;
  email: string;
  university: string;
  program: string;
  semester: number;
  year: number; // angkatan
};

// Data dummy. Di Phase 4 datang dari GET /api/user.
const initialProfile: Profile = {
  name: "Aizhia Azwan",
  email: "aizhia@mahasiswa.ac.id",
  university: "Universitas Pamulang",
  program: "Teknik Informatika",
  semester: 4,
  year: 2024,
};

type ProfileContextValue = {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ profile, updateProfile }),
    [profile, updateProfile],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error("useProfile harus dipakai di dalam ProfileProvider");
  return ctx;
}
