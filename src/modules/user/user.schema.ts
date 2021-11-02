import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop()
  _id: number;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  password_salt: string;

  @Prop()
  mobile: number;

  @Prop()
  role: 0 | 1 | 2; // 超管、管理、普通用户

  @Prop()
  status: 0 | 1; // 失效、有效

  @Prop()
  create_by: string;

  @Prop()
  create_time: string;

  @Prop()
  update_by: string;

  @Prop()
  update_time: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
