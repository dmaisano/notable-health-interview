import { getRepository, Repository } from "typeorm";
import { Doctor } from "../entities";

class DoctorService {
  constructor() {}

  private doctorRepo() {
    return getRepository(Doctor);
  }

  async findDoctors(): Promise<Doctor[]> {
    return this.doctorRepo().find();
  }

  async createDoctor({
    repo,
    firstName,
    lastName,
  }: {
    repo: Repository<Doctor>;
    firstName: string;
    lastName: string;
  }): Promise<Doctor | null> {
    return repo.save({ firstName, lastName });
  }
}

export default new DoctorService();
