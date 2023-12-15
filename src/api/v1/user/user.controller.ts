import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response } from 'express'

@Controller('api/v1/user')
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

  @Post('/test')
  findAll(@Res({ passthrough: true }) res: Response, @Body() input: any) {
    res.cookie('token', 'test_token', {
      httpOnly: true,
      maxAge: 6000,
    })
    console.log(input)

    return this.userService.findAll()
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.userService.logout(res)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
