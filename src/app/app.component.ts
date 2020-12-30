import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginResp, ITokenRefresh, IUSer } from './Interfaces/app-interface';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser$: Observable<IUSer>;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser(): void {
    if (localStorage.getItem('user') != null) {
      let user: ILoginResp = JSON.parse(localStorage.getItem('user'));
      if (this.tokenService.tokenExpired(user.token)) {
        user = this.userService.refreshToken(user);
      }
      this.currentUser$ = this.userService.currentUser$;
      this.userService.setCurrentUser(user);
    }
  }
}
