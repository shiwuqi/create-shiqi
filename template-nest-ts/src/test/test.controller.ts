import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { TestService } from './test.service';
import { Test } from './test.entity';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    @Get()
    get(): string {
        return this.testService.getHelloNest();
    }

    @Post()
    create(@Body() test: Test) {
        Logger.log(test);
        return this.testService.create(test);
    }
}
