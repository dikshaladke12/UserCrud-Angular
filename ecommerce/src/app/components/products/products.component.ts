import { Component } from '@angular/core';
import * as prod from './products.json'

interface product {
  id: Number,
  title:string,
  description:string,
  price: Number,
  rating: string,
  stock : string,
  brand:string,
  category:string,
  images:string
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: any= (prod as any).default;
}
