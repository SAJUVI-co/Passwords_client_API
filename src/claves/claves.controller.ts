import {
  Controller,
  Post,
  Body,
  Inject,
  NotFoundException,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseBoolPipe,
  // Patch,
  // Delete,
} from '@nestjs/common';
// import { UpdateClaveDto } from './dto/update-clave.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserClaveDto } from './dto/create-clave.dto';

@Controller('claves')
export class ClavesController {
  constructor(
    @Inject('CLAVES_SERVICE') private readonly userServiceClient: ClientProxy, // Cliente del microservicio
  ) {}

  @Post()
  create(@Body() createClaveDto: CreateUserClaveDto) {
    try {
      const newUser = this.userServiceClient.send(
        { cmd: 'createUser' },
        createClaveDto,
      );
      return newUser;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  @Get()
  findAllUsers(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
    @Query('order', new DefaultValuePipe('ASC')) order: string,
    @Query('sh', ParseBoolPipe) sh: boolean,
  ) {
    try {
      const users = this.userServiceClient.send(
        { cmd: 'findAllUsers' },
        { skip, limit, order, sh },
      );
      return users;
    } catch (error: any) {
      return new NotFoundException(error);
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.clavesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateClaveDto: UpdateClaveDto) {
  //   return this.clavesService.update(+id, updateClaveDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.clavesService.remove(+id);
  // }
}
