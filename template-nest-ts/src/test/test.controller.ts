import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';
import { Request } from 'express';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    @Get()
    get(): string {
        return this.testService.getHelloNest();
    }

    @Post()
    create(@Body() request: Request) {
        return '成功';
    }
}
