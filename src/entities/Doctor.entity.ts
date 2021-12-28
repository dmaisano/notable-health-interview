import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment.entity";

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @OneToMany(() => Appointment, (appt) => appt.doctorId, {
    eager: false,
    onDelete: `CASCADE`,
  })
  appointments: Appointment[];
}
