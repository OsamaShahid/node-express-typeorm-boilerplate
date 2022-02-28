import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("files")
export class File extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  updated_by?: string;

  @Column()
  created_by: string;

  @Column("json")
  file_info: string;

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
