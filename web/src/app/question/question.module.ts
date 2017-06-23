import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { MdListModule } from '@angular/material';

import { QuestionListComponent }    from './question-list.component';
import { QuestionDetailComponent }  from './question-detail.component';
import { ResponseListComponent } from '../response/response-list.component';
import { RecordingComponent } from '../recording/recording.component';

import { DataService } from '../data.service';

import { QuestionRoutingModule } from './question-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        QuestionRoutingModule,
        MdListModule
    ],
    declarations: [
        QuestionListComponent,
        QuestionDetailComponent,
        ResponseListComponent,
        RecordingComponent
    ],
    providers: [ DataService ]
})
export class QuestionModule {}
