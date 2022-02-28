import bcrypt from "bcryptjs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  Not,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: () => "user" })
  role: string; // 1- admin, 2- user, 3- customer, 4- sponsor

  @Column({ default: () => "0" })
  is_archived: number; // 1- archived, 0- non-archived

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: () => "0" })
  deleted: number;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ default: () => "0" })
  is_mobile_verified: number;

  @Column({ default: () => "0" })
  is_email_verified: number;

  @Column({ nullable: true })
  customer?: string;

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

  static async isEmailTaken(email: string, excludeUserId: any = null) {
    const user = await User.findOne({
      where: [{ email }, { id: Not(excludeUserId) }],
    });
    return !!user;
  }

  async isPasswordMatch(password: string): Promise<boolean> {
    const user = this;
    return bcrypt.compare(password, user.password);
  }

  @BeforeInsert()
  private async beforeInsert() {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
  }
}
