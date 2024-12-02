import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  product = [
    {
      "product": "headphone",
      "imageUrl": '/assets/shopping.webp'
    },
    {
      "product": "laptop",
      "imageUrl": '/assets/shopping3.webp'
    }
  ];
  description = "An electronic product refers to a device that utilizes electronic science and technology, such as microelectronics and electronic computers, to process information, convert energy, and perform various functions like storage, computation, and contro"

}
