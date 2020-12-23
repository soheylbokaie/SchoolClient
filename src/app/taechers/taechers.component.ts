import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ITeacherView } from '../Interfaces/app-interface';
import { IDepartment } from '../Interfaces/Department-interface';

@Component({
  selector: 'app-taechers',
  templateUrl: './taechers.component.html',
  styleUrls: ['./taechers.component.css'],
})
export class TaechersComponent implements OnInit {
  base_url = this.httpService.base_url;
  departments: IDepartment;
  constructor(private http: HttpClient, private httpService: HttpService) {}
  ngOnInit(): void {
    this.get_Teachers();
  }

  show() {
    console.log(this.departments);
  }

  get_Teachers() {
    this.http.get(this.base_url + 'GetAlldepartments').subscribe(
      (response: IDepartment) => {
        this.departments = response['departments'];
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
