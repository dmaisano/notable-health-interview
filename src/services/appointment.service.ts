import { Equal, getRepository, Repository } from "typeorm";
import { Appointment, Doctor } from "../entities";
import {
  doctorAppointmentsToMap,
  getDay,
  hasApptSlotAvailable,
} from "../utils";

class AppointmentService {
  constructor() {}

  private apptRepo() {
    return getRepository(Appointment);
  }

  private doctorRepo() {
    return getRepository(Doctor);
  }

  async findDoctorAppointments(
    doctorId: number,
    date: Date,
  ): Promise<Appointment[]> {
    const appts = await this.apptRepo().find({
      where: { doctorId },
    });

    // this is not an optimal solution, we are potentially fetching more data than needed from the DB. Best to handle this in SQL and fetch only the data we need on the given date
    return appts.filter((appt) => getDay(appt.time) === getDay(date));
  }

  async createAppointment(payload: {
    doctorId: number;
    patientFirstName: string;
    patientLastName: string;
    time: Date;
    kind: string;
  }): Promise<Appointment | null | { error: string }> {
    const { doctorId, kind, patientFirstName, patientLastName, time } = payload;

    if (kind !== `New Patient` && kind !== `Follow-up`)
      return { error: `appt type must be either 'New Patient' or 'Follow-up'` };

    const isValidTime = time.getMinutes() % 15 === 0;

    if (!isValidTime) return { error: `appt time must be interval of 15min` };

    const doctor = await this.doctorRepo().findOne(doctorId);

    if (!doctor) return null;

    const map = doctorAppointmentsToMap(doctor);

    const canSchedule = hasApptSlotAvailable(map, time);

    if (!canSchedule) return { error: `too many appts booked` };

    const appt = await this.apptRepo().save({
      doctorId,
      patientFirstName,
      patientLastName,
      time,
      kind,
    });

    return appt || null;
  }

  async removeAppointment(id: number): Promise<boolean> {
    const res = await this.apptRepo().delete(id);

    if (res && res.affected) {
      return res.affected > 0;
    }

    return false;
  }
}

export default new AppointmentService();
