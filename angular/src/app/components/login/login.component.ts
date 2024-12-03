import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  myForm: any = FormGroup;
  constructor(
    private fb: FormBuilder, 
    private apiCall: ApiServiceService
  ){}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.apiCall.login(this.myForm.getRawValue()).subscribe({
      next: (res)=>{
        console.log("login successfull", res)
        localStorage.setItem("loginData", JSON.stringify(res.userData))
      },
      error: (err)=>{
        console.log("error", err)
      }
    })
  }
} 
