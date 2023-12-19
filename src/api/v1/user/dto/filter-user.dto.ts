import { IsNotEmpty } from 'class-validator'

export class Filters {
  email?: string

  roleId?: string

  @IsNotEmpty()
  limit: number

  @IsNotEmpty()
  page: number
}
