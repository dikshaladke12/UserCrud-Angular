import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',

})
export class PostComponent implements OnInit {

  user : any[]=[];
  userInfo :any;
  
  firstName: any;
  lastName: any;
  age: any;
  email: any;
  userName: any

  constructor(private apiService: ApiServiceService){  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void{
    this.apiService.fetchAllUser().subscribe(response=>{
      this.user= response.userData;
      console.log("user", this.user)
    })
  }

  view(id: any): void{
    this.apiService.fetchUserById(id).subscribe({
      next: res=>{
        this.firstName = res.userData.firstName;
        this.lastName = res.userData.lastName;
        this.age = res.userData.age;
        this.email = res.userData.email;
        this.userName = res.userData.userName;
      }
    })
  }

  delete(id: any):void{
    console.log("id :", id)
    this.apiService.deleteUser(id).subscribe({
      next: res=>{
        console.log("id deleted", res);
        this.fetchData()
      }
    })
  }
}
