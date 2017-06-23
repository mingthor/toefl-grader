import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuestionListComponent }    from './question-list.component';
import { QuestionDetailComponent }  from './question-detail.component';

const questionRoutes: Routes = [
  { path: 'problemsets/speaking',  component: QuestionListComponent },
  { path: 'problemsets/speaking/:key', component: QuestionDetailComponent }
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
