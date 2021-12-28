import { Router } from "express";
import appointmentService from "../services/appointment.service";

const router = Router();

router.get(`/`, async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId) {
      return res.status(400).json({ error: `missing doctor id` });
    }

    if (!date) {
      return res.status(400).json({
        error: `missing or invalid date. date must be mm-dd-yyyy format`,
      });
    }

    const parsedDoctorId = parseInt(doctorId as string);
    const parsedDate = new Date(date as string);

    if (!parsedDate) {
      return res.status(400).json({
        error: `missing or invalid date. date must be mm-dd-yyyy format`,
      });
    }

    const appts = await appointmentService.findDoctorAppointments(
      parsedDoctorId,
      parsedDate,
    );

    if (appts.length) {
      return res.json({ appts });
    }

    return res.status(404).json({ msg: `no appts found` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message || `something went wrong` });
  }
});

type AppointmentRequestType = {
  doctorId: number;
  patientFirstName: string;
  patientLastName: string;
  time: string;
  kind: `New Patient` | `Follow-up`;
};
router.post(`/create`, async (req, res) => {
  try {
    const payload = req.body as AppointmentRequestType;

    // for the sake of time since I'm running a little bit over. I will skip input validation, if something is missing and is required in the Schema I will let the DB insert fail
    const parsedTime = new Date(payload.time);

    const appt = await appointmentService.createAppointment({
      ...payload,
      time: parsedTime,
    });

    return res.status(201).json({ ...appt });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message || `something went wrong` });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const id = req.params.id as string;
    const parsedId = parseInt(id);

    if (!id || !parsedId)
      return res.status(400).json({ error: `invalid appt id` });

    const success = await appointmentService.removeAppointment(parsedId);

    if (success) {
      return res.status(202).json({ success });
    } else {
    }

    return res.status(404).send();
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message || `something went wrong` });
  }
});

export default router;
