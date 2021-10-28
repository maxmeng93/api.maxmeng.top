// import { Schema } from 'mongoose';

// export const userSchema = new Schema({
//   _id: { type: Number, required: true },
//   username: { type: String, required: true },
//   password: { type: String, required: true },
// });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop()
  _id: number;

  @Prop()
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
