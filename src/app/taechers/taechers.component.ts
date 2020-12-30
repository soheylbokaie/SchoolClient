import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ITeacherView } from '../Interfaces/Teacher-interface';
import { IDepartment } from '../Interfaces/Department-interface';

@Component({
  selector: 'app-taechers',
  templateUrl: './taechers.component.html',
  styleUrls: ['./taechers.component.css'],
})
export class TaechersComponent implements OnInit {
  baseUrl = this.httpService.baseUrl;
  departments: IDepartment;
  constructor(private http: HttpClient, private httpService: HttpService) {}
  ngOnInit(): void {
    this.get_Teachers();
  }

  show(): void {
    console.log(this.departments);
  }

  get_Teachers(): void {
    this.http.get(this.baseUrl + 'GetAlldepartments').subscribe(
      (response: IDepartment) => {
        this.departments = response['departments'];
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
