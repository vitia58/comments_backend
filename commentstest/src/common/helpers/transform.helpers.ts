import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export const NumberTransform = () => Transform((e) => e.value && +e.value);

const booleanValues = { true: true, false: false };
export const BooleanTransform = () => Transform((e) => booleanValues[e.value]);

export const ArrayTransform = (isOptional = false) =>
  Transform((e) => e.value ?? (isOptional ? undefined : []));

export const OptionalTransform = () =>
  applyDecorators(
    Transform((e) => (e.value === '' ? undefined : e.value)),
    IsOptional(),
  );

export const MongoTransform = () =>
  Transform((e) => {
    if (!e.value) {
      return e.value;
    }

    if (Array.isArray(e.value)) {
      console.log('HERE');
      return e.value.map((e: string) => new Types.ObjectId(e));
    }

    if (typeof e.value == 'string') {
      return new Types.ObjectId(e.value);
    }

    return e.value;
  });
