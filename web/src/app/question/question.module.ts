import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { QuestionListComponent }    from './question-list.component';
import { QuestionDetailComponent }  from './question-detail.component';
import { ResponseListComponent } from '../response/response-list.component';

import { QuestionService } from './question.service';

import { QuestionRoutingModule } from './question-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    QuestionRoutingModule
  ],
  declarations: [
    QuestionListComponent,
    QuestionDetailComponent,
    ResponseListComponent
  ],
  providers: [ QuestionService ]
})
export class QuestionModule {}
