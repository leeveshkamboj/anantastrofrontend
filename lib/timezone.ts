// Frontend timezone utilities

// Using Intl API for timezone handling (built into browsers)
export function convertTime(
  time: string,
  fromTimezone: string,
  toTimezone: string,
  date: Date = new Date(),
): string {
  if (fromTimezone === toTimezone) {
    return time;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes || 0, 0, 0);

  // Create date strings in both timezones
  const fromDateStr = dateTime.toLocaleString('en-US', {
    timeZone: fromTimezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  // Parse the time from the source timezone
  const tempDate = new Date(
    date.toLocaleString('en-US', { timeZone: fromTimezone }),
  );
  tempDate.setHours(hours, minutes || 0, 0, 0);

  // Convert to target timezone
  const toDateStr = tempDate.toLocaleString('en-US', {
    timeZone: toTimezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  // Extract time from the formatted string
  const timeMatch = toDateStr.match(/(\d{2}):(\d{2})/);
  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`;
  }

  return time;
}

export function getCurrentTime(timezone: string): string {
  const now = new Date();
  const timeStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  return match ? match[0] : '00:00';
}

export function formatDateTime(
  dateTime: Date | string,
  timezone: string,
  format: 'short' | 'long' | 'time' = 'short',
): string {
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

  if (format === 'time') {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (format === 'short') {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return (tz.getTime() - utc.getTime()) / (1000 * 60 * 60);
}

export function getTimezoneDisplayName(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find((p) => p.type === 'timeZoneName')?.value || '';
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    return `${city} (${timeZoneName})`;
  } catch {
    return timezone;
  }
}

export const COMMON_TIMEZONES = {
  'Asia': [
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Dubai', label: 'UAE (GST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Tokyo', label: 'Japan (JST)' },
    { value: 'Asia/Shanghai', label: 'China (CST)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
    { value: 'Asia/Bangkok', label: 'Thailand (ICT)' },
    { value: 'Asia/Kuala_Lumpur', label: 'Malaysia (MYT)' },
  ],
  'Europe': [
    { value: 'Europe/London', label: 'UK (GMT/BST)' },
    { value: 'Europe/Paris', label: 'France (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Germany (CET/CEST)' },
    { value: 'Europe/Madrid', label: 'Spain (CET/CEST)' },
    { value: 'Europe/Rome', label: 'Italy (CET/CEST)' },
  ],
  'America': [
    { value: 'America/New_York', label: 'US Eastern (EST/EDT)' },
    { value: 'America/Chicago', label: 'US Central (CST/CDT)' },
    { value: 'America/Denver', label: 'US Mountain (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'US Pacific (PST/PDT)' },
    { value: 'America/Toronto', label: 'Canada Eastern (EST/EDT)' },
    { value: 'America/Vancouver', label: 'Canada Pacific (PST/PDT)' },
  ],
  'Australia': [
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
    { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
    { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
    { value: 'Australia/Perth', label: 'Perth (AWST)' },
  ],
  'Other': [
    { value: 'Africa/Cairo', label: 'Egypt (EET)' },
    { value: 'Africa/Johannesburg', label: 'South Africa (SAST)' },
    { value: 'Pacific/Auckland', label: 'New Zealand (NZDT/NZST)' },
  ],
};
