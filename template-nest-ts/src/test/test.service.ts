import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    getHelloNest(): string {
        return 'Hello Nest!';
    }
}