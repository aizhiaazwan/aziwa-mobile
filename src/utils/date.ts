const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// Zona waktu dihitung manual (WIB = UTC+7) agar sama di semua perangkat.
function toWib(iso: string) {
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth(),
    year: d.getUTCFullYear(),
    hh: String(d.getUTCHours()).padStart(2, "0"),
    mm: String(d.getUTCMinutes()).padStart(2, "0"),
    key: d.toISOString().slice(0, 10),
  };
}

export function formatDate(iso: string) {
  const t = toWib(iso);
  return `${String(t.day).padStart(2, "0")} ${MONTHS[t.month]} ${t.year}`;
}

export function formatTime(iso: string) {
  const t = toWib(iso);
  return `${t.hh}:${t.mm} WIB`;
}

export function formatDeadline(iso: string) {
  return `${formatDate(iso)} • ${formatTime(iso)}`;
}

export function isSameDay(a: string | Date, b: string | Date) {
  return (
    toWib(new Date(a).toISOString()).key ===
    toWib(new Date(b).toISOString()).key
  );
}

export function hoursLeft(iso: string, now: Date) {
  return Math.max(
    0,
    Math.round((new Date(iso).getTime() - now.getTime()) / 3600000),
  );
}

export function daysLeft(iso: string, now: Date) {
  return (new Date(iso).getTime() - now.getTime()) / 86400000;
}

export function monthYearLabel(now: Date) {
  const t = toWib(now.toISOString());
  const full = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${full[t.month]} ${t.year}`;
}

export const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// Hari dalam seminggu menurut WIB (0=Minggu)
export function weekdayWib(d: Date) {
  return new Date(d.getTime() + 7 * 3600 * 1000).getUTCDay();
}

// ---- Kunci tanggal 'YYYY-MM-DD' (WIB) ----
export function dateKey(d: Date) {
  return new Date(d.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

export function keyParts(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return { y, m: m - 1, d, weekday: dt.getUTCDay() };
}

export function addDaysKey(key: string, n: number) {
  const { y, m, d } = keyParts(key);
  return new Date(Date.UTC(y, m, d + n)).toISOString().slice(0, 10);
}

export function formatKeyShort(key: string) {
  const p = keyParts(key);
  return `${p.d} ${MONTHS[p.m]}`;
}

export function formatKeyLong(key: string) {
  const p = keyParts(key);
  return `${DAY_NAMES[p.weekday]}, ${p.d} ${MONTHS[p.m]} ${p.y}`;
}

export function keyToYMD(key: string) {
  const p = keyParts(key);
  return { y: p.y, m: p.m, d: p.d };
}

export function ymdToKey(v: { y: number; m: number; d: number }) {
  return `${v.y}-${String(v.m + 1).padStart(2, '0')}-${String(v.d).padStart(2, '0')}`;
}

// ---- Jam 'HH:MM' ----
export function parseHM(s: string) {
  const [hh, mm] = s.split(':').map(Number);
  return { hh, mm };
}

export function formatHM(t: { hh: number; mm: number }) {
  return `${String(t.hh).padStart(2, '0')}:${String(t.mm).padStart(2, '0')}`;
}

export const toMinutes = (t: { hh: number; mm: number }) => t.hh * 60 + t.mm;