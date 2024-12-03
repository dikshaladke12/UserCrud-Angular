import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registrationForm :any= FormGroup;
  image: any

  constructor(
    private apiCall: ApiServiceService,
    private fb: FormBuilder){
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      email: ['',[ Validators.required, Validators.email]],
      userName: ['', Validators.required],
      image: [''],
      password: ['', Validators.required],
      
    })
    
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file && file ) {
      this.image = file;
    } else {
      alert('Please select a valid image file.');
    }
  }


  onSubmit(){
    this.apiCall.register(this.registrationForm.getRawValue()).subscribe({
      next: (res)=>{
        console.log("response", res)
      },
      error: (err)=>{
        console.log("error", err)
      }
    })
  }

}
