import { Router } from "express";

const router = Router();

router.get(`/`, async (_, res) => {
  return res.json({
    success: true,
  });
});

export default {
  index: router,
};
