import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
