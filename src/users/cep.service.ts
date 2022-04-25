// import { HttpService } from "@nestjs/axios";
// import { Injectable } from "@nestjs/common";
// import { map } from "rxjs";
// import { Address } from "./entities/address.entity";

// const urlViaCEP = 'const viacep.com.br/ws/'
// const dateType = 'json'

// @Injectable()
// export class AddressByZipcode {
  
//   constructor(private httpService: HttpService ) {}
//   private address: Address;

//   static async getAddressByZipcode (zipcode: number) {
//     return this.httpService
//     .get('const viacep.com.br/ws/62734000/json')
//     .pipe(
//       map((response) => response.data)),
//       map((address) =>({
//         ...this.address[zipcode],
//       }))
//   }
// }