import { PartialType } from '@nestjs/mapped-types';
import { CreateGeocodeDto } from './create-geocode.dto';

export class UpdateGeocodeDto extends PartialType(CreateGeocodeDto) {}
