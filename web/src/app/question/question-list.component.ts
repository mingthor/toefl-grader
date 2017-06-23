import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2';
import { DataService }  from '../data.service';
import { MdListModule } from '@angular/material';

@Component({
  templateUrl: './question-list.component.html',
  styleUrls: ['../app.component.css']
})
export class QuestionListComponent implements OnInit {

  questions: FirebaseListObservable<any>;
  selectedKey: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.selectedKey = params['key'];
        console.log("init key = " + this.selectedKey);
    });
    
    this.dataService.getQuestions().then(questions => this.questions = questions);
  }

  isSelected(key: string ) {
    return key === this.selectedKey;
  }

  onSelect(key: string) {
    console.log("key = " + key);
    this.router.navigate(['/problemsets/speaking', key]);
  }
}
