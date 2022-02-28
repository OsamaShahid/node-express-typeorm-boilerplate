import { User } from "../models/user.model";
export class UserHandler {
  static async saveNewUser(data: any) {
    const user = new User();

    user.first_name = data.firstName;
    user.last_name = data.lastName;
    user.password = data.password;
    user.email = data.email;
    user.mobile = data.mobile;
    await user.save();
    return user;
  }

  static getUserByEmail(email: string) {
    const query = {
      email,
    };

    return User.findOne({ where: query });
  }

  static getUserById(id: string) {
    return User.findOne(id);
  }
}
