import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private location: Location) {}
  baseUrl = 'https://localhost:5001/';
  departments: string[];
  idtoken: string;
  back(): void {
    this.location.back();
  }
}
