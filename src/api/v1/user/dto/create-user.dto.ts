import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Min(6)
  @Max(20)
  password: string

  @IsNotEmpty()
  roleId: string
}
