import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment.development'

@Injectable({
  providedIn: 'root'
})

export class ApiServiceService {

  private baseUrl = environment.baseUrl;

  constructor( private http: HttpClient ) { } 

  fetchAllUser(): Observable<any>{
    return this.http.get(`${this.baseUrl}/details`)
  }

  fetchUserById(id: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/detail/${id}`)
  }

  deleteUser(id: string): Observable<any>{
    return this.http.delete(`${this.baseUrl}/delete/${id}`)
  }

  updateUser(id: string, user: any): Observable<any>{
    return this.http.put(`${this.baseUrl}/update/${id}`,user)
  }

  changePassword(user: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/changePassword`,user)
  }

}
