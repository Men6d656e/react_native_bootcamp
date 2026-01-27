import { Document, Model } from "mongoose";
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(userPassword: string): Promise<boolean>;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=User.model.d.ts.map