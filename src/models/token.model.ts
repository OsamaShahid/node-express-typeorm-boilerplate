import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("tokens")
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user: string;

  @Column()
  type: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  updated_by?: string;

  @Column()
  created_by: string;

  @Column({ default: () => "false" })
  black_listed: boolean;

  @Column()
  expires: Date;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updated_at: Date;
}
