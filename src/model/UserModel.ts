import { Schema, model, Types } from "mongoose"

export interface IUser {
    email: string;
    name: string;
    password: string;
    admin?: boolean;
}

const userSchema = new Schema<IUser> ({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
});

export const User = model<IUser>("User", userSchema);