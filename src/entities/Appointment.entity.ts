import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from ".";

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  patientFirstName: string;

  @Column({ nullable: false })
  patientLastName: string;

  @Column({ nullable: false })
  time: Date;

  @Column({ nullable: false })
  kind: string; // could use an int or enum here, for simplicity I'm going to stick with a string

  @Column()
  doctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: `doctorId` })
  doctor: Doctor;
}
