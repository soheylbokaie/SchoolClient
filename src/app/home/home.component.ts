import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}
  images = [
    {
      path: 'assets/foundersalw_6106_mobile.jpg',
      caption: 'School Once Again on Shanghai List',
    },
    {
      path: 'assets/nankai-campus-building-statue_hero.jpg',
      caption: "Among the World's Best Universities",
    },
    {
      path: 'assets/video-bg.jpg',
      caption: 'International University',
    },
  ];
  ngOnInit(): void {}
}
