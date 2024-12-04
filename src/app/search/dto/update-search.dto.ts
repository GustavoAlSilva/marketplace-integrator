import { IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsString } from 'class-validator';

export class UpdateSearchDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
