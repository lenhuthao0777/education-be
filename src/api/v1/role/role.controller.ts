import { Controller, Get, UseGuards } from '@nestjs/common'
import { RoleService } from './role.service'
import { AuthGuard } from '../user/auth.guard'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @Get()
  roles() {
    return this.roleService.roles()
  }
}
