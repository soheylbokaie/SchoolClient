import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private location: Location) {}
  base_url = 'https://localhost:5001/';
  departments: string[];
  idtoken: string;
  public get_url_no_params(api_link: string) {}
  back() {
    this.location.back();
  }
}
