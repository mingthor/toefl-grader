import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionListComponent }    from './question/question-list.component';
import { QuestionDetailComponent }  from './question/question-detail.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/problemsets/speaking', pathMatch: 'full' },
  { path: 'problemsets/:section', component: QuestionListComponent },
  { path: 'problemsets/:section/:key', component: QuestionDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
