import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  text: string ="Welcome to our website!"
  imageUrl: string='/assets/welcome.jpg';
}
