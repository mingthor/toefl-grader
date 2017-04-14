import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { QuestionService }  from './question.service';

@Component({
  template: `
    <div id="questions-card-container" class="mdl-cell mdl-cell--12-col mdl-grid">
      <!-- Questions container -->
      <div id="questions-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
        <div class="mdl-card__supporting-text mdl-color-text--grey-600">
         <h2>TOEFL Speaking Questions</h2>
         <ul class="questions">
           <li *ngFor="let question of questions | async"
             [class.selected]="isSelected(question.$key)"
             (click)="onSelect(question.$key)">
             <div class="question">
               <span *ngIf="question.id">{{ question.id }}.</span>
               <span *ngIf="question.text"><a>{{ question.text }}/</a></span>
             </div>
             <div>
               <span *ngIf="question.category">{{ question.category }}</span>
               <span *ngIf="question.type">{{ question.type }}</span>
             </div>
           </li>
         </ul>
        </div>
      </div>
    </div>
  `
})
export class QuestionListComponent implements OnInit {

  questions: FirebaseListObservable<any>;
  selectedKey: string;

  constructor(
    private service: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.selectedKey = params['key'];
        console.log("init key = " + this.selectedKey);
    });
    
    this.service.getQuestions().then(questions => this.questions = questions);
  }

  isSelected(key: string ) {
    return key === this.selectedKey;
  }

  onSelect(key: string) {
    console.log("key = " + key);
    this.router.navigate(['/questions', key]);
  }
}
