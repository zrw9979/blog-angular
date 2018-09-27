import { Router } from '@angular/router';
import { MsgService } from './../../services/msg/msg.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  name = 'test';
  pwd = '123456';
  blogname = '';
  github = '';
  email = '';
  phone = '';
  hasUser = false;

  constructor(
    private http: HttpClient,
    private msg: MsgService,
    private router: Router
  ) { }

  ngOnInit() {
    this.http.get('/api/admin/userInfo').subscribe((res) => {
      if (res['code'] !== 200) {
        this.msg.info( res['msg'] );
      } else {
        const userArr = res['data']
        if (userArr.length > 0) {
          const user = userArr[0]
          this.name = user.name;
          this.pwd = user.pwd;
          this.blogname = user.blogname;
          this.github = user.github;
          this.email = user.email;
          this.phone = user.phone;
          this.hasUser = true;
        }
      }
    });
  }

  login() {
    if (this.hasUser) {
      this.http.post('/api/admin/setting', {
        name: this.name,
        pwd: this.pwd,
        blogname: this.blogname,
        github: this.github,
        email: this.email,
        phone: this.phone
      }).subscribe((res) => {
        if (res['code'] !== 200) {
          this.msg.info( res['msg'] );
        } else {
          this.router.navigate(['/admin/add']);
        }
      });
    } else {
      this.http.post('/api/admin/addUser', {
        name: this.name,
        pwd: this.pwd,
        blogname: this.blogname,
        github: this.github,
        email: this.email,
        phone: this.phone
      }).subscribe((res) => {
        if (res['code'] !== 200) {
          this.msg.info( res['msg'] );
        } else {
          this.router.navigate(['/admin/add']);
        }
      });
    }
  }
}
