import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello From Agency Backend! By abdullah117765";
  }
}
