import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('dropdownMenuState', [
      state('inactive', style({
        height: '0'
      })),
      state('active',   style({
        height: '110px'
      })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out'))
    ])
  ],
})
export class AppComponent {
  blogName = ''

  dropdownMenu = {
    state: 'inactive'
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.http.get('/api/client/userInfo')
      .subscribe((res) => {
        this.blogName = res['data'].blogname
      });
  }

  list() {
    this.router.navigate(['/home']);
    this.dropdownMenu.state = 'inactive';
  }

  tag() {
    this.router.navigate(['/tag']);
    this.dropdownMenu.state = 'inactive';
  }

  about() {
    this.router.navigate(['/about']);
    this.dropdownMenu.state = 'inactive';
  }

  search() {
    this.router.navigate(['/search']);
    this.dropdownMenu.state = 'inactive';
  }

  link() {
    this.router.navigate(['/link']);
    this.dropdownMenu.state = 'inactive';
  }

  toggleDropdownMenu(e) {
    this.dropdownMenu.state === 'active' ? this.dropdownMenu.state = 'inactive' : this.dropdownMenu.state = 'active';
    e.stopPropagation();
  }
}
