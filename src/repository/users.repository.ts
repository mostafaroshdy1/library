import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ilike, like, sql } from 'drizzle-orm';
import { Repository, User } from 'src/db/drizzle';
import { users } from 'src/db/schema/user.schema';
import { UserModels } from 'src/models/user.models';
import { DRIZZLE } from 'src/modules/drizzle.module';

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE) private readonly repository: Repository<User>) {}

  async getById(id: number) {
    const user = await this.repository
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    return user[0];
  }

  async getByEmail(email: string) {
    const user = await this.repository
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    return user[0];
  }

  create(data: UserModels.CreateReq) {
    return this.repository
      .insert(users)
      .values(data)
      .returning({ id: users.id, username: users.username, email: users.email })
      .execute();
  }

  update(id: number, data: UserModels.UpdateReq) {
    return this.repository
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning({ id: users.id, username: users.username, email: users.email })
      .execute();
  }

  deleteById(id: number) {
    return this.repository.delete(users).where(eq(users.id, id)).execute();
  }

  getAll(data: UserModels.GetAllReq) {
    const { limit, offset, email, username, id } = data;
    const query = this.repository
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .limit(limit)
      .offset(offset);

    if (email) query.where(eq(users.email, email));

    if (username) query.where(eq(users.username, username));

    if (id) query.where(eq(users.id, id));

    return query.execute();
  }
}
