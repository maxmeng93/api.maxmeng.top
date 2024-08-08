import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/users.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
    const saltOrRounds = 10;
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      saltOrRounds,
    );
    console.log(`加密后数据: `, event.entity);
  }
}
