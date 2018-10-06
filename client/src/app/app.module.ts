import { TagService } from './services/tag/tag.service';
import { ArticleService } from './services/article/article.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestArticlesComponent, FilterNoteContentPipe } from './pages/latest-articles/latest-articles.component';
import { ArchivesComponent } from './pages/archives/archives.component';
import { TagComponent } from './pages/tag/tag.component';
import { AboutComponent } from './pages/about/about.component';
import { SearchComponent } from './pages/search/search.component';
import { LinkComponent } from './pages/link/link.component';
import { ViewArticleComponent } from './pages/view-article/view-article.component';

@NgModule({
  declarations: [
    AppComponent,
    LatestArticlesComponent,
    ArchivesComponent,
    TagComponent,
    LinkComponent,
    AboutComponent,
    SearchComponent,
    FilterNoteContentPipe,
    ViewArticleComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    ArticleService,
    TagService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
