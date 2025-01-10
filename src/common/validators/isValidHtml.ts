import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { verifyHTML } from '../functions/verifyhtml';

export function IsValidHTML(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Html_validator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          try {
            verifyHTML(value);
            return true;
          } catch (error) {
            this.reason = error.message;
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return this.reason || 'Validation failed.';
        },
      },
    });
  };
}
