import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AdminGuardGuard } from './admin-guard.guard';
import { AdminPanelCoursesComponent } from './admin-panel-courses/admin-panel-courses.component';
import { AdminPanelDepartmentsComponent } from './admin-panel-departments/admin-panel-departments.component';
import { AdminPanelStudentsComponent } from './admin-panel-students/admin-panel-students.component';
import { AdminPanelTeachersComponent } from './admin-panel-teachers/admin-panel-teachers.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ContainerComponent } from './container/container.component';
import { ControlPanelGuardGuard } from './control-panel-guard.guard';
import { CoursesControllComponent } from './courses-controll/courses-controll.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { ShowTeachersComponent } from './show-teachers/show-teachers.component';
import { StudentControllComponent } from './student-controll/student-controll.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { TaechersComponent } from './taechers/taechers.component';
import { TeacherControllComponent } from './teacher-controll/teacher-controll.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'Departments', component: TaechersComponent },
      { path: '404-error', component: NotFoundComponent },
    ],
  },

  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [ControlPanelGuardGuard],
    canActivateChild: [ControlPanelGuardGuard],
    children: [
      {
        path: 'Departments',
        canActivate: [AdminGuardGuard],
        component: AdminPanelDepartmentsComponent,
      },
      {
        path: 'Students',
        canActivate: [AdminGuardGuard],
        component: AdminPanelStudentsComponent,
      },
      {
        path: 'Students/detail/:studentid',
        canActivate: [AdminGuardGuard],
        component: StudentDetailsComponent,
      },
      {
        path: 'Students/detail',
        component: StudentDetailsComponent,
      },
      {
        path: 'Students/:depid',
        canActivate: [AdminGuardGuard],
        component: StudentControllComponent,
      },

      {
        path: 'Courses',
        canActivate: [AdminGuardGuard],
        component: AdminPanelCoursesComponent,
      },
      {
        path: 'Courses/:id',
        canActivate: [AdminGuardGuard],
        component: CoursesControllComponent,
      },
      {
        path: 'Teachers',
        canActivate: [AdminGuardGuard],
        component: AdminPanelTeachersComponent,
      },
      {
        path: 'Teachers/detail/:teacherid',
        canActivate: [AdminGuardGuard],
        component: TeacherDetailsComponent,
      },
      {
        path: 'Teachers/detail',
        component: TeacherDetailsComponent,
      },

      { path: 'Teachers/:depid', component: TeacherControllComponent },
      {
        path: 'register-admin',
        canActivate: [AdminGuardGuard],
        component: AddAdminComponent,
      },
      { path: '', component: UserProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
