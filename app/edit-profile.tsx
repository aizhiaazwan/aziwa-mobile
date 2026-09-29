import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { FadeInView } from '@/components/ui/FadeInView';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { useProfile } from '@/contexts/ProfileContext';
import { colors, fonts } from '@/constants/theme';

type Errors = Partial<Record<'name' | 'email' | 'semester' | 'year', string>>;

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [university, setUniversity] = useState(profile.university);
  const [program, setProgram] = useState(profile.program);
  const [semester, setSemester] = useState(String(profile.semester));
  const [year, setYear] = useState(String(profile.year));

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const validate = () => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Nama wajib diisi.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Format email tidak valid.';
    const s = Number(semester);
    if (!Number.isInteger(s) || s < 1 || s > 14) e.semester = 'Semester harus angka 1 sampai 14.';
    const y = Number(year);
    if (!Number.isInteger(y) || y < 2000 || y > 2100) e.year = 'Angkatan harus berupa tahun, misal 2024.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (saving || !validate()) return;
    setSaving(true);
    // Simulasi jeda jaringan. Di Phase 4 diganti PUT /api/user.
    timer.current = setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        university: university.trim(),
        program: program.trim(),
        semester: Number(semester),
        year: Number(year),
      });
      setSaving(false);
      setToast('Profil diperbarui');
      timer.current = setTimeout(() => router.back(), 900);
    }, 500);
  };

  const err = (msg?: string) =>
    msg ? <AppText style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.danger, marginTop: 6 }}>{msg}</AppText> : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Kembali" style={styles.back}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <AppText variant="heading" style={{ flex: 1 }}>Edit Profil</AppText>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FadeInView style={styles.inner}>
            <View>
              <TextField label="Nama Lengkap" icon="user" value={name} onChangeText={setName} placeholder="Nama lengkap" />
              {err(errors.name)}
            </View>
            <View>
              <TextField
                label="Email Kampus"
                icon="mail"
                value={email}
                onChangeText={setEmail}
                placeholder="contoh@mahasiswa.ac.id"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {err(errors.email)}
            </View>
            <TextField label="Universitas" icon="award" value={university} onChangeText={setUniversity} placeholder="Nama universitas" />
            <TextField label="Program Studi" icon="book" value={program} onChangeText={setProgram} placeholder="Program studi" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <TextField label="Semester" icon="hash" value={semester} onChangeText={setSemester} keyboardType="number-pad" maxLength={2} />
                {err(errors.semester)}
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="Angkatan" icon="calendar" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} />
                {err(errors.year)}
              </View>
            </View>

            <View style={{ gap: 12, marginTop: 4 }}>
              <Button
                label="Simpan Perubahan"
                loading={saving}
                onPress={handleSave}
                iconLeft={<Feather name="save" size={20} color="#fff" />}
              />
              <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.cancel}>
                <AppText style={{ fontFamily: fonts.semibold, fontSize: 16 }}>Batal</AppText>
              </Pressable>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast message={toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 20 },
  cancel: { height: 48, alignItems: 'center', justifyContent: 'center' },
});