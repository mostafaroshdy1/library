export namespace ErrorMessages {
  export enum hash {
    limit = 'Hashed string can not be longer than 72 characters',
  }

  export enum localStorage {
    storeNotFound = 'Local storage store not found',
  }

  export enum user {
    notFound = 'User not found',
    invalidCredentials = 'Invalid email or password',
    emailExists = 'Email already exists',
    userNotFound = 'User not found',
  }

  export enum common {
    emptyUpdateData = 'Update data cannot be empty',
  }
}
