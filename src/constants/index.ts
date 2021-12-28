import path from "path";

export const __prod__ = process.env.NODE_ENV === `production`;

export const PROJECT_ROOT_DIR: string = path.resolve(__dirname, "../../");
