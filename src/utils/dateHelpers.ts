import { format, parse, parseISO } from 'date-fns';

// API UTC string -> form datetime-local string
export const utcToDateTimeLocal = (utcString: string | null): string => {
  if (!utcString) return '';
  // "2024-03-21T14:30:00Z" -> "2024-03-21T14:30"
  return format(parseISO(utcString), "yyyy-MM-dd'T'HH:mm");
};

// API UTC string -> form date string
export const utcToDate = (utcString: string | null): string => {
  if (!utcString) return '';
  // "2024-03-21T00:00:00Z" -> "2024-03-21"
  return format(parseISO(utcString), 'yyyy-MM-dd');
};

// form datetime-local string -> API UTC string
export const dateTimeLocalToUtc = (localString: string | null): string | null => {
  if (!localString) return null;
  // "2024-03-21T14:30" -> "2024-03-21T14:30:00Z"
  const date = parse(localString, "yyyy-MM-dd'T'HH:mm", new Date());
  return date.toISOString();
};

// form date string -> API UTC string
export const dateToUtc = (localString: string | null): string | null => {
  if (!localString) return null;
  // "2024-03-21" -> "2024-03-21T00:00:00Z"
  const date = parse(localString, 'yyyy-MM-dd', new Date());
  return date.toISOString();
}; 