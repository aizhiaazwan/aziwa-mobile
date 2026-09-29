const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Zona waktu dihitung manual (WIB = UTC+7) agar sama di semua perangkat.
function toWib(iso: string) {
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  return {
    day: d.getUTCDate(),
    month: d.getUTCMonth(),
    year: d.getUTCFullYear(),
    hh: String(d.getUTCHours()).padStart(2, '0'),
    mm: String(d.getUTCMinutes()).padStart(2, '0'),
    key: d.toISOString().slice(0, 10),
  };
}

export function formatDate(iso: string) {
  const t = toWib(iso);
  return `${String(t.day).padStart(2, '0')} ${MONTHS[t.month]} ${t.year}`;
}

export function formatTime(iso: string) {
  const t = toWib(iso);
  return `${t.hh}:${t.mm} WIB`;
}

export function formatDeadline(iso: string) {
  return `${formatDate(iso)} • ${formatTime(iso)}`;
}

export function isSameDay(a: string | Date, b: string | Date) {
  return toWib(new Date(a).toISOString()).key === toWib(new Date(b).toISOString()).key;
}

export function hoursLeft(iso: string, now: Date) {
  return Math.max(0, Math.round((new Date(iso).getTime() - now.getTime()) / 3600000));
}

export function daysLeft(iso: string, now: Date) {
  return (new Date(iso).getTime() - now.getTime()) / 86400000;
}

export function monthYearLabel(now: Date) {
  const t = toWib(now.toISOString());
  const full = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${full[t.month]} ${t.year}`;
}