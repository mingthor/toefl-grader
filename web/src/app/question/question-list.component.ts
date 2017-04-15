import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { QuestionService }  from './question.service';

@Component({
  templateUrl: './question-list.component.html',
  styleUrls: ['../app.component.css']
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
