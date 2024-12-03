import { Component, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {

  userId: any
  user : any
  constructor(private route: ActivatedRoute,
      private callApi: ApiServiceService
  ){}
  ngOnInit(){
    this.userId = this.route.snapshot.paramMap.get('id')
    console.log("userid", this.userId)
    this.callApi.fetchUserById(this.userId).subscribe(
      res=>{
        this.user= res.userData
      }
    )
  }

  update(){
    let inputData ={
      firstName : this.user.firstName,
      lastName : this.user.lastName,
      age: this.user.age,
      email: this.user.email,
      userName: this.user.userName
    }

    this.callApi.updateUser(this.userId, inputData).subscribe({
      next: (res: any)=>{
        console.log(res,"resws");
        
        alert(res.message)
      }
    })

  }
}
