import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginResp, IUSer } from './Interfaces/app-interface';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentUser$: Observable<IUSer>;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }
  setCurrentUser() {
    if (localStorage.getItem('user') != null) {
      const user: ILoginResp = JSON.parse(localStorage.getItem('user'));
      this.currentUser$ = this.userService.currentUser$;
      this.userService.setCurrentUser(user);
    }
  }
}
