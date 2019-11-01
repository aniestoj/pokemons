import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  search() {
    this.router.navigate([this.formGroup.value.id]);
  }

  private initFormGroup() {
    this.formGroup = this.fb.group({
      id: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(1),
        Validators.min(1)]
      ]
    });
  }
}
