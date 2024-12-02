import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  myForm:any= FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name : new FormControl('',Validators.required),
      subject:new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }
  onSubmit(){
    console.log(this.myForm?.value)
  }
}
