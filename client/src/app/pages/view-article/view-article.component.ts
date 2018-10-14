import { style } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { ArticleService } from '../../services/article/article.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import marked from 'marked';
import highlight from 'highlight.js';
import Gitment from '../../../assets/gitment/gitment.js';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewArticleComponent implements OnInit, OnDestroy {
  articleDetail: ArticleDetail = {
    articleContent: '',
    date: '',
    label: '',
    state: '',
    title: '',
    pv: 0,
    uv: 0,
    __v: 0,
    _id: ''
  };
  articleId = '';
  articleServiceSub: Subscription;
  likeArticle = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.articleId = params.id;
    });
    const topBar = <HTMLElement>document.querySelector('.top-bar');
    topBar.style.display = 'none';

    let currentArticle = JSON.parse(localStorage.getItem('articleDetail'));
    console.log(currentArticle)

    let likeThisArticle = JSON.parse(localStorage.getItem(`like${currentArticle._id}`));
    this.likeArticle = likeThisArticle ? true : false;
    
    this.articleDetail = currentArticle;
    if (this.articleDetail === null) {
      this.articleServiceSub = this.articleService.allArticle$.subscribe((data) => {
        data.forEach((item: ArticleDetail) => {
          if (item._id === this.articleId) {
            this.articleDetail = item;
            this.renderHighlight();
            this.renderGitment();
          }
        });
      });
    } else {
      this.http.post('/api/client/articleAddPv', currentArticle).subscribe((res) => {
        console.log(res)
      });
      this.renderHighlight();
      this.renderGitment();
    }

    const progressBar = <HTMLElement>document.querySelector('.progress-bar');
    document.querySelector('.view-article-wrap').scrollTop = 0;
    document.querySelector('.view-article-wrap').addEventListener('scroll', () => {
      const scrollHeight = document.querySelector('.view-article-wrap').scrollHeight - window.innerHeight; // 滚动高度
      const scrollTop = document.querySelector('.view-article-wrap').scrollTop; // 滚动内容距离顶部的高度
      const percentage = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = percentage + 'vw';
    });

    const footer = <HTMLElement>document.querySelector('.footer');
    footer.style.display = 'none';
  }

  ngOnDestroy() {
    const topBar = <HTMLElement>document.querySelector('.top-bar');
    topBar.style.display = 'block';
    if (this.articleDetail instanceof Subscription) {
      this.articleServiceSub.unsubscribe();
    }

    const footer = <HTMLElement>document.querySelector('.footer');
    footer.style.display = 'block';
    location.reload();
  }

  // 语法高亮
  private renderHighlight() {
    this.articleDetail.articleContent =  marked(this.articleDetail.articleContent, {
      renderer: new marked.Renderer(),
      gfm: true,
      pedantic: false,
      sanitize: false,
      tables: true,
      breaks: true,
      smartLists: true,
      smartypants: true,
      highlight: function (code) {
        return highlight.highlightAuto(code).value;
      }
    });
  }

  likeThisArticle() {
    let currentArticle = JSON.parse(localStorage.getItem('articleDetail'));
    let likeArticle = JSON.parse(localStorage.getItem(`like${this.articleDetail._id}`));
    console.log(likeArticle)
    if (this.likeArticle) {
      localStorage.removeItem(`like${this.articleDetail._id}`);
      currentArticle.uv -= 1;
      let like = JSON.parse(localStorage.getItem(`like${this.articleDetail._id}`));
      console.log(like)
      this.http.post('/api/client/articleAddUv', currentArticle).subscribe((res) => {
        this.likeArticle = false;
        this.articleDetail = currentArticle;
        localStorage.setItem('articleDetail', JSON.stringify(currentArticle));
        console.log(res)
      });
    } else {
      localStorage.setItem(`like${this.articleDetail._id}`, 'true');
      currentArticle.uv += 1;
      let like = JSON.parse(localStorage.getItem(`like${this.articleDetail._id}`));
      console.log(like)
      this.http.post('/api/client/articleAddUv', currentArticle).subscribe((res) => {
        this.likeArticle = true;
        this.articleDetail = currentArticle;
        localStorage.setItem('articleDetail', JSON.stringify(currentArticle));
        console.log(res)
      });
    }
  }

  // 评论系统
  private renderGitment() {
    const el = <HTMLElement>document.querySelector('.gitment_id');
    const myTheme = {
      render(state, instance) {
        const container = document.createElement('div');
        container.lang = 'en-US';
        container.className = 'gitment-container gitment-root-container';
        container.appendChild(instance.renderEditor(state, instance));
        container.appendChild(instance.renderComments(state, instance));
        return container;
      },
    };
    const gitment = new Gitment({
      id: this.articleDetail._id,
      owner: 'ruiwenruiwen',
      repo: 'sd-comment',
      oauth: {
        client_id: 'cc6a9e084f2fe28c97f2',
        client_secret: '7b15e829fb810f3aa950d1470337497c4edd9d24',
      },
      theme: myTheme
    });
    gitment.render(el);
  }
}

interface ArticleDetail {
  articleContent: string;
  date: string;
  label: string;
  state: string;
  pv: Number;
  uv: Number;
  title: string;
  __v: number;
  _id: string;
}
