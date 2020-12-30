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
  ngOnDestroy(): void {}
  profile_image = 'assets/undraw_profile.svg';
  wink_icon: IconDefinition;
  title: string;
  name: string;
  currentUser$: Observable<IUSer>;
  role: string;
  id: string;
  ngOnInit(): void {
    this.wink_icon = faLaughWink;
    this.userService.currentUser$.subscribe((params) => {
      this.name = params?.name;
      this.role = params?.role;
      this.id = params?.id;
    });
    if (this.role == 'Student') {
      this.http
        .get(this.userService.base_url + 'api/getStudent/' + this.id)
        .subscribe((response: IStudentView) => {
          if (response.photo != null) {
            this.profile_image =
              this.userService.base_url + 'api/getStudentprofile/' + this.id;
          }
        });
    }
  }
  logout() {
    this.userService.logout();
  }
}
