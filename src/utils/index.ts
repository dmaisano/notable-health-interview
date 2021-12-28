import { Doctor } from "../entities";

export type AppointmentMapType = {
  [day: string]: {
    [time: string]: number;
  };
};

export const hasApptSlotAvailable = (
  map: AppointmentMapType,
  dateObj: Date,
) => {
  const day = getDay(dateObj);
  const time = getTime(dateObj);

  if (!map[day]) {
    return true;
  }

  if (map[day][time]) {
    return map[day][time] < 3;
  }

  return true;
};

export const doctorAppointmentsToMap = (doctor: Doctor) => {
  const map: AppointmentMapType = {};

  for (const appt of doctor.appointments) {
    if (!appt.time) continue;
    const apptDay = getDay(appt.time);
    const apptTime = getTime(appt.time);

    if (!map[apptDay]) map[apptDay] = {};

    if (!map[apptDay][apptTime]) {
      map[apptDay][apptTime] = 1;
    } else {
      map[apptDay][apptTime]++;
    }
  }

  return map;
};

export const getDay = (date: Date) => {
  return date.toDateString();
};

export const getTime = (date: Date) => {
  return `${date.getHours()}-${date.getMinutes()}`;
};
