import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Repository, ShelfLocation } from 'src/db/drizzle';
import { shelfLocations } from 'src/db/schema/shelfLocations.schema';
import { DRIZZLE } from 'src/modules/drizzle.module';

@Injectable()
export class ShelfLocationRepository {
  constructor(
    @Inject(DRIZZLE) private readonly repository: Repository<ShelfLocation>,
  ) {}

  async create(name: string) {
    const shelfLocation = await this.repository
      .insert(shelfLocations)
      .values({ name })
      .returning()
      .execute();
    return shelfLocation[0];
  }

  async getByName(name: string) {
    const shelfLocation = await this.repository
      .select()
      .from(shelfLocations)
      .where(eq(shelfLocations.name, name))
      .execute();

    return shelfLocation[0];
  }
}
