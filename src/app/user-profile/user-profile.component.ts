import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ITeacherView, IUSer } from '../Interfaces/app-interface';
import { TokenService } from '../token.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [
    './user-profile.component.css',
    '../admin-panel/sb-admin-2.min.css',
  ],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private http: HttpClient,
    private httpService: HttpService
  ) {}
  base_url = this.httpService.base_url;
  currentUser$: Observable<IUSer>;
  name: string;
  role: string;
  id: string;
  user: ITeacherView;
  ngOnInit(): void {
    this.currentUser$ = this.userService.currentUser$;
    this.currentUser$.subscribe((params) => {
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
    });
    if (this.role == 'Teacher') {
      this.getTeacher();
    }
  }

  getTeacher() {
    this.http
      .get(this.base_url + 'api/getTeacher/' + this.id)
      .subscribe((params: ITeacherView) => {
        this.user = params;
      });
  }
}
