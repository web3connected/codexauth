/* eslint-disable quotes */
/* eslint-disable indent */
/** @format */

import React, { useMemo, useState, useEffect } from 'react';

const holidays: { name: string; date: string }[] = [
  { name: "Happy New Year's Day", date: '01/01' },
  { name: 'Happy Birthday Martin Luther King Jr. Day', date: '01/??' },
  { name: "Happy President's Day", date: '02/??' },
  { name: 'Happy Memorial Day', date: '05/??' },
  { name: 'Happy Independence Day', date: '07/04' },
  { name: 'Happy Internet Day', date: '09/02' }, // September 2nd, 1969
  { name: 'Happy Labor Day', date: '09/??' },
  { name: 'Happy Columbus Day', date: '10/??' },
  { name: 'Happy Veterans Day', date: '11/11' },
  { name: 'Happy Thanksgiving Day', date: '11/??' },
  { name: 'Merry Christmas Eve', date: '12/24' },
  { name: 'Merry Christmas', date: '12/25' },
  { name: "Happy New Year's Eve Day", date: '12/31' },
];

// Helper function to calculate Easter
const calculateEasterDate = (year: number): string => {
  const easterMonth = (19 * (year % 19) + 24) % 30;
  const easterDay = (2 * (year % 4) + 4 * (year % 7) + 6 * easterMonth + 5) % 7;
  let easterDate = `03/${
    easterDay + 22 + (easterDay === 6 && easterMonth > 10 ? 7 : 0)
  }`;
  if (easterMonth === 29 || (easterMonth === 28 && easterDay === 6)) {
    easterDate = `04/${easterDay + 15}`;
  }
  return easterDate;
};

const DateGreeter: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Use effect to set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Compute date values only on client to avoid hydration mismatch
  const today = isClient ? new Date() : null;
  const year = today ? today.getFullYear() : new Date().getFullYear();
  const currentHour = today ? today.getHours() : 12;

  // Memoize the holidays array with Easter included
  const updatedHolidays = useMemo(() => {
    const easterDate = calculateEasterDate(year);
    return [...holidays, { name: 'Easter', date: easterDate }];
  }, [year]);

  // Determine the current date and check for a holiday
  const todayString = today ? `${today.getMonth() + 1}/${today.getDate()}` : '';
  const holiday = isClient ? updatedHolidays.find(
    (holiday) => holiday.date === todayString
  ) : null;

  // Memoize the greeting, icon color, and icon based on the time of day
  const { greeting, iconColor, dayIcon } = useMemo(() => {
    if (!isClient) {
      // Server-side render with neutral defaults
      return {
        greeting: 'Welcome!',
        iconColor: 'text-blue-600',
        dayIcon: 'sun',
      };
    }

    const greeting =
      currentHour < 12
        ? 'Good morning!'
        : currentHour < 18
        ? 'Good afternoon!'
        : 'Good evening!';

    const iconColor =
      currentHour < 12
        ? 'text-blue-600' // Morning
        : currentHour < 18
        ? 'text-white' // Afternoon
        : 'text-gray-500'; // Evening and night

    const dayIcon = currentHour < 18 ? 'sun' : 'moon'; // Sun for Morning/Afternoon, Moon for Evening/Night

    return { greeting, iconColor, dayIcon };
  }, [currentHour, isClient]);

  return (
    <div className="flex items-center text-base">
      <a
        href="/services/onthisday"
        aria-disabled="true"
        className="flex items-center text-inherit no-underline mr-1.5"
        onClick={(e) => {
          e.preventDefault(); // Prevent the default link behavior
          alert('This feature is coming soon.'); // Display the alert message
        }}
      >
        <span className={`fa fa-${dayIcon} mr-1.5 text-lg ${iconColor}`} />
        <time className="flex items-center gap-1.5" suppressHydrationWarning>
          {!isClient ? (
            // Server-side placeholder
            <>Welcome! | <span className="fa fa-calendar text-sm opacity-70" /> {' '}</>
          ) : holiday ? (
            <>
              {holiday.name}! Today is <span className="fa fa-calendar text-sm opacity-70 ml-1" /> {today?.toLocaleDateString()}.
            </>
          ) : (
            <>
              {greeting} | <span className="fa fa-calendar text-sm opacity-70" /> {today?.toLocaleDateString()}
            </>
          )}
        </time>
      </a>
    </div>
  );
};

export default DateGreeter;
