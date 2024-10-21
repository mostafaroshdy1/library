import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import Configuration from './configuration';
import { Config } from './App.Config.Models';

@Injectable()
export class AppConfig implements OnModuleInit {
  constructor(
    @Inject(Configuration.KEY)
    public config: ConfigType<typeof Configuration>,
  ) {}

  onModuleInit() {
    this.validateConfig();
  }

  async validateConfig() {
    try {
      const configDto = plainToClass(Config, this.config);
      const errors: ValidationError[] = await validate(configDto);

      if (errors.length > 0) {
        console.error('Validation errors in the .env file:');
        this.displayValidationErrors(errors);
        process.exit(1); // Terminate the application if configuration is not valid
      }
    } catch (e) {
      console.error('An error occurred during validation:', e);
      process.exit(1); // Terminate the application if an error occurs
    }
  }

  displayValidationErrors(errors: ValidationError[], parentProperty = '') {
    errors.forEach((error) => {
      if (error.constraints) {
        console.error(
          `- Property "${parentProperty}${error.property}" failed validation: ${Object.values(
            error.constraints,
          ).join(', ')}`,
        );
      }
      if (error.children && error.children.length > 0) {
        this.displayValidationErrors(error.children, `${error.property}.`);
      }
    });
  }
}
