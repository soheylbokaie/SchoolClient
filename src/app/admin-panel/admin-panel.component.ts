import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faLaughWink, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { IUSer } from '../Interfaces/app-interface';
import { IStudentView } from '../Interfaces/Student-interface';
import { UserService } from '../user.service';
@Component({
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css', './sb-admin-2.min.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient
  ) {}
  profileImage = 'assets/undraw_profile.svg';
  wink_icon: IconDefinition;
  name: string;
  currentUser$: Observable<IUSer>;
  role: string;
  id: string;
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.wink_icon = faLaughWink;
    this.userService.currentUser$.subscribe((params) => {
      this.name = params?.name;
      this.role = params?.role;
      this.id = params?.id;
    });
    if (this.role === 'Student') {
      this.http
        .get(this.userService.baseUrl + 'api/getStudent/' + this.id)
        .subscribe((response: IStudentView) => {
          if (response.photo != null) {
            this.profileImage =
              this.userService.baseUrl + 'api/getStudentprofile/' + this.id;
          }
        });
    }
  }
  logout(): void {
    this.userService.logout();
  }
}
