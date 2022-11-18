import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';

@Injectable()
export class TestService {

    constructor(
        @InjectRepository(Test) private testRepository: Repository<Test>,
    ) { }

    getHelloNest(): string {
        return 'Hello Nest!';
    }

    async create(test: Test) {
        this.testRepository.save(test);
    }
}