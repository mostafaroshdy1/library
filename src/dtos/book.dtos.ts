export namespace BookDtos {
  export class model {
    constructor(init?: Partial<BookDtos.model>) {
      Object.assign(this, init);
    }
    title: string;
    ISBN: string;
    authorId: number;
    qty: number;
    shelfLocationId: number;
  }
}
