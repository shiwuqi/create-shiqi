import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    @Get()
    get(): string {
        return this.testService.getHelloNest();
    }

    @Post()
    create(@Body() test: String) {
        return '成功';
    }
}
