import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',

})
export class PostComponent implements OnInit {

  user : any[]=[];
  data : any;

  constructor(private apiService: ApiServiceService){  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void{
    this.apiService.fetchAllUser().subscribe(response=>{
      this.user= response.userData;
    })
  }

  fetchDataById(id: any): void{
    this.apiService.fetchUserById(id).subscribe(response=>{
      console.log(response,"fffffff")
      this.data =response.userData;
    })
  }

  delete(id: any):void{
    this.apiService.deleteUser(id).subscribe()
  }

}
