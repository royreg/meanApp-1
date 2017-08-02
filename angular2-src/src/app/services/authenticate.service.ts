import { User } from '../shared/User';
import { Injectable } from '@angular/core';
import {Http,Headers} from '@angular/http';
import {AppConfig} from '../shared/AppConfig';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt'

@Injectable()
export class AuthenticateService {
  authToken: any;
  user: any;


  constructor(private http: Http) { }



  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'users/register',user,{headers: headers})
      .map(res=>res.json());
  }
  autheniticate(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(AppConfig.API_ENDPOINT+'users/authenticate',user,{headers: headers})
      .map(res=>res.json());
  }
  
  
  getProfile(){
    let headers = new Headers();
    this.getToken();
    headers.append('Content-Type','application/json');
    headers.append('Authorization',this.authToken);
    return this.http.get(AppConfig.API_ENDPOINT+'users/profile',{headers: headers})
      .map(res=>res.json());
  }

  getToken(){
    const token=localStorage.getItem('id_token');
    this.authToken=token;
  }
  
  
  
  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken=token;
    this.user=user;
  }

  loggedIn(){
   // console.log(tokenNotExpired('id_token'));
    return tokenNotExpired('id_token');
  }


  logout(){
    this.authToken=null;
    this.user=null;
    localStorage.clear();
  }

}
