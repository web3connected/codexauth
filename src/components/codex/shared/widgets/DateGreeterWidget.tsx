'use client';

import React, { useState, useEffect } from 'react';

interface DateGreeterWidgetProps {
  customGreeting?: string;
}

// Holiday detection functions
const getEasterDate = (year: number): Date => {
  // Computus algorithm for calculating Easter
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

const getThanksgivingDate = (year: number): Date => {
  // 4th Thursday of November
  const november = new Date(year, 10, 1); // November (month 10)
  const firstDay = november.getDay();
  const firstThursday = firstDay <= 4 ? 5 - firstDay : 12 - firstDay;
  return new Date(year, 10, firstThursday + 21); // 4th Thursday
};

const getMemorialDay = (year: number): Date => {
  // Last Monday of May
  const june = new Date(year, 5, 1); // June 1st
  june.setDate(0); // Last day of May
  const lastDay = june.getDay();
  const lastMonday = june.getDate() - ((lastDay + 6) % 7);
  return new Date(year, 4, lastMonday);
};

const getLaborDay = (year: number): Date => {
  // First Monday of September
  const september = new Date(year, 8, 1);
  const firstDay = september.getDay();
  const firstMonday = firstDay === 0 ? 2 : firstDay === 1 ? 1 : 9 - firstDay;
  return new Date(year, 8, firstMonday);
};

// Cache for holidays
let cachedYear: number | null = null;
let cachedHolidays: Map<string, string> | null = null;

const getHolidays = (year: number): Map<string, string> => {
  if (cachedYear === year && cachedHolidays) {
    return cachedHolidays;
  }

  const holidays = new Map<string, string>();
  
  // Fixed holidays
  holidays.set(`${year}-01-01`, "🎉 Happy New Year");
  holidays.set(`${year}-02-14`, "💝 Happy Valentine's Day");
  holidays.set(`${year}-03-17`, "☘️ Happy St. Patrick's Day");
  holidays.set(`${year}-07-04`, "🎆 Happy Independence Day");
  holidays.set(`${year}-10-31`, "🎃 Happy Halloween");
  holidays.set(`${year}-11-11`, "🎖️ Happy Veterans Day");
  holidays.set(`${year}-12-24`, "🎄 Merry Christmas Eve");
  holidays.set(`${year}-12-25`, "🎅 Merry Christmas");
  holidays.set(`${year}-12-31`, "🎊 Happy New Year's Eve");
  
  // Variable holidays
  const easter = getEasterDate(year);
  const easterStr = `${year}-${String(easter.getMonth() + 1).padStart(2, '0')}-${String(easter.getDate()).padStart(2, '0')}`;
  holidays.set(easterStr, "🐰 Happy Easter");
  
  const thanksgiving = getThanksgivingDate(year);
  const thanksgivingStr = `${year}-${String(thanksgiving.getMonth() + 1).padStart(2, '0')}-${String(thanksgiving.getDate()).padStart(2, '0')}`;
  holidays.set(thanksgivingStr, "🦃 Happy Thanksgiving");
  
  const memorialDay = getMemorialDay(year);
  const memorialStr = `${year}-${String(memorialDay.getMonth() + 1).padStart(2, '0')}-${String(memorialDay.getDate()).padStart(2, '0')}`;
  holidays.set(memorialStr, "🇺🇸 Happy Memorial Day");
  
  const laborDay = getLaborDay(year);
  const laborStr = `${year}-${String(laborDay.getMonth() + 1).padStart(2, '0')}-${String(laborDay.getDate()).padStart(2, '0')}`;
  holidays.set(laborStr, "⚒️ Happy Labor Day");

  cachedYear = year;
  cachedHolidays = holidays;
  
  return holidays;
};

const getGreeting = (date: Date): string => {
  const hour = date.getHours();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;
  
  // Check for holidays first
  const holidays = getHolidays(year);
  if (holidays.has(dateKey)) {
    return holidays.get(dateKey)!;
  }
  
  // Time-based greetings
  if (hour >= 5 && hour < 12) {
    return '🌅 Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return '☀️ Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return '🌆 Good Evening';
  } else {
    return '🌙 Good Night';
  }
};

const formatDate = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName} - ${monthName} ${dayNum}, ${year}`;
};

const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const DateGreeterWidget: React.FC<DateGreeterWidgetProps> = ({
  customGreeting,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="flex items-center text-sm h-6"></div>;
  }

  const greeting = customGreeting || getGreeting(currentTime);
  const dateStr = formatDate(currentTime);
  const timeStr = formatTime(currentTime);

  return (
    <div className="flex items-center text-sm">
      <div className="flex items-center gap-2">
        <span className="font-sans font-bold text-white">
          {greeting}: {dateStr}
        </span>
        <span className="font-sans text-blue-400">{timeStr}</span>
      </div>
    </div>
  );
};

export default DateGreeterWidget;
