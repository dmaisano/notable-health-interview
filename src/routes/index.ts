import { Router } from "express";
import appointmentRoute from "./appointment.route";
import doctorRoute from "./doctor.route";

const router = Router();

router.get(`/`, async (_, res) => {
  return res.json({
    success: true,
  });
});

export default {
  index: router,
  appointmentRoute,
  doctorRoute,
};
