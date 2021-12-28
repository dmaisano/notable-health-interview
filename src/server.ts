import cors from "cors";
import express from "express";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { PROJECT_ROOT_DIR, __prod__ } from "./constants";
import { Appointment, Doctor } from "./entities";
import routes from "./routes";
import appointmentService from "./services/appointment.service";
import doctorService from "./services/doctor.service";

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors()); // enabling cors wildcard for this small demo

  const conn = await createConnection({
    type: `sqlite`,
    database: `${PROJECT_ROOT_DIR}/data/database.sqlite`,
    synchronize: !__prod__,
    logging: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Appointment, Doctor],
  });
  await conn.runMigrations();

  // seed some initial data
  if (conn) {
    const doctorRepo = await conn.getRepository(Doctor);
    const apptRepo = await conn.getRepository(Appointment);

    const doctors = await doctorRepo.find();
    if (doctors.length < 1) {
      const drDoe = await doctorService.createDoctor({
        repo: doctorRepo,
        firstName: `John`,
        lastName: `Doe`,
      });
      const drJoel = await doctorService.createDoctor({
        repo: doctorRepo,
        firstName: `Billy`,
        lastName: `Joel`,
      });

      if (drDoe) doctors.push(drDoe);
      if (drJoel) doctors.push(drJoel);
    }

    const appts = await apptRepo.find();
    if (appts.length < 1) {
      await appointmentService.createAppointment({
        doctorId: doctors[0].id,
        time: new Date(`12-28-2021 14:15`),
        kind: `New Patient`,
        patientFirstName: `Peter`,
        patientLastName: `Parker`,
      });
    }
  }

  app.use(`/api`, routes.index);
  app.use(`/api/appointments`, routes.appointmentRoute);
  app.use(`/api/doctors`, routes.doctorRoute);

  const SERVER_PORT = process.env.PORT || 3001;
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}/api`);
  });
};

main().catch(console.error);
