import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  user = {};
  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http.get('/api/client/userInfo')
      .subscribe((res) => {
        this.user = res['data']
        console.log(this.user)
      });
  }

}
