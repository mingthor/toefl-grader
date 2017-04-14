import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionListComponent }    from './question-list.component';
import { QuestionDetailComponent }  from './question-detail.component';

const questionRoutes: Routes = [
  { path: 'questions',  component: QuestionListComponent },
  { path: 'questions/:key', component: QuestionDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(questionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class QuestionRoutingModule { }
