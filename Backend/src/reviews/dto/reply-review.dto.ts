import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ReplyReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Reply cannot be empty' })
  @Length(1, 1000, { message: 'Reply must be between 1 and 1000 characters' })
  reply: string;
}

