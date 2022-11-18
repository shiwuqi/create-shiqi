import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';

@Injectable()
export class TestService {

    constructor(
        @InjectRepository(Test) private testRepository: Repository<Test>,
    ) { }

    async getTestList(): Promise<Test[]> {
        return await this.testRepository.find();
    }

    findOne(id: string): Promise<Test> {
        return this.testRepository.findOne({
            where: {
                id: Number(id)
            }
        });
    }

    async create(test: Test) {
        const result = await this.testRepository.save(test);
        return result;
    }

    async delete(id: string): Promise<void> {
        await this.testRepository.delete(id);
    }
}