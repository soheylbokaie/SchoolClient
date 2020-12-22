import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { ICourse } from '../Interfaces/Course-interface';

@Component({
  selector: 'app-courses-controll',
  templateUrl: './courses-controll.component.html',
  styleUrls: [
    './courses-controll.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class CoursesControllComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    private http: HttpClient
  ) {}
  courseId: string;
  course: ICourse;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.GetCourse();
  }

  GetCourse() {
    this.http
      .get(this.httpService.base_url + 'api/GetCourse/' + this.courseId)
      .subscribe((params: ICourse) => {
        this.course = params[0];
      });
  }
}
