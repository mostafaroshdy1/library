import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Repository, Author } from 'src/db/drizzle';
import { authors } from 'src/db/schema/author.schema';
import { DRIZZLE } from 'src/modules/drizzle.module';

@Injectable()
export class AuthorRepository {
  constructor(
    @Inject(DRIZZLE) private readonly repository: Repository<Author>,
  ) {}

  async getByName(name: string) {
    const author = await this.repository
      .select()
      .from(authors)
      .where(eq(authors.name, name))
      .execute();

    return author[0];
  }

  async create(data: { name: string }) {
    const author = await this.repository
      .insert(authors)
      .values(data)
      .returning()
      .execute();
    return author[0];
  }
}
