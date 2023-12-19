import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response } from 'express'
import { Filters } from './dto/filter-user.dto'
import { AuthGuard } from './auth.guard'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() input: CreateUserDto) {
    return this.userService.create(input)
  }

  @Post('/login')
  login(@Res({ passthrough: true }) res: Response, @Body() input: any) {
    return this.userService.login(res, input)
  }

  @Get()
  users(@Query() filters: any) {
    return this.userService.users(filters)
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  user(@Param('email') email: string) {
    return this.userService.user(email)
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.userService.logout(res)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
