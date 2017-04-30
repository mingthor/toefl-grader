import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { QuestionListComponent }    from './question-list.component';
import { QuestionDetailComponent }  from './question-detail.component';
import { ResponseListComponent } from '../response/response-list.component';

import { DataService } from '../data.service';

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
    providers: [ DataService ]
})
export class QuestionModule {}
