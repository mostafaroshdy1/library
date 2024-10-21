import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Repository, User } from 'src/db/drizzle';
import { users } from 'src/db/schema/user.schema';
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

  create(data: { username: string; email: string; password: string }) {
    return this.repository
      .insert(users)
      .values(data)
      .returning({ username: users.username, email: users.email })
      .execute();
  }

  update(
    id: number,
    data: { username: string; email: string; password: string },
  ) {
    return this.repository
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning({ username: users.username, email: users.email })
      .execute();
  }

  deleteById(id: number) {
    return this.repository.delete(users).where(eq(users.id, id)).execute();
  }

  getAll() {
    return this.repository.select().from(users).execute();
  }
}
