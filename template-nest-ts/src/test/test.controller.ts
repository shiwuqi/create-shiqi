import { Controller, Get, Post, Delete, Body, Logger, Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { TestService } from './test.service';
import { Test } from './test.entity';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    @Get()
    findAll() {
        return this.testService.getTestList()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id) {
        return this.testService.findOne(id);
    }

    @Post()
    create(@Body() test: Test) {
        Logger.log(test);
        return this.testService.create(test);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id) {
        return this.testService.delete(id);
    }
}
