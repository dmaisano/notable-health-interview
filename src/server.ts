import cors from "cors";
import express from "express";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { PROJECT_ROOT_DIR, __prod__ } from "./constants";
import { Appointment, Doctor } from "./entities";
import routes from "./routes";

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

  app.use(`/api`, routes.index);

  const SERVER_PORT = process.env.PORT || 3001;
  app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}/api`);
  });
};

main().catch(console.error);
