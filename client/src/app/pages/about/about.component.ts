import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  user = {};
  email = '';

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

  subscribe() {
    const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (this.email.trim() && emailReg.test(this.email)) {
      // TODO send email
      console.log(this.email)
    } else {
      alert('请输入正确的邮件格式')
      return
    }
    this.http.post('/api/client/addFansEmail', {email: this.email})
      .subscribe((res) => {
        if (res['code'] !== 200) {
          alert(res['msg'])
        } else {
          alert('订阅成功')
          this.email = ''
        }
      });
  }
}
