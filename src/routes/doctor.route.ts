import { Router } from "express";
import doctorService from "../services/doctor.service";

const router = Router();

router.get(`/`, async (req, res) => {
  try {
    const doctors = await doctorService.findDoctors();

    return res.json(doctors);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error?.message || `something went wrong` });
  }
});

export default router;
