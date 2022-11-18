import { Controller, Get, Post, Body } from '@nestjs/common';
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
        return this.testService.create(test);
    }
}
