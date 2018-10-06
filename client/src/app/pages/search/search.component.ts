import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  articleList = [];
  searchContent = '';
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    
  }

  search() {
    if (!this.searchContent.trim()) {
      alert('请输入搜索内容')
      return
    }
    this.http.post('/api/client/searchTitle', { search: this.searchContent })
    .subscribe((res) => {
      this.articleList = res['data']
      console.log(this.articleList)
    });
  }

  viewArticle(data) {
    let newData = data;
    newData.pv += 1;
    localStorage.setItem('articleDetail', JSON.stringify(newData));
    this.router.navigate(['/view', data._id]);
  }

}
