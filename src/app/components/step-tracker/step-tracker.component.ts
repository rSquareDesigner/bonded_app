import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-step-tracker',
  templateUrl: './step-tracker.component.html',
  styleUrls: ['./step-tracker.component.scss']
})
export class StepTrackerComponent implements OnInit {

  @Input() step_number: number;
  @Input() total_steps: number;

  constructor() { }

  ngOnInit() {
    //console.log('this.step_number',this.step_number);
  }

}
