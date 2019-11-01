import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonDetails } from '../../models/pokemon-details';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit, OnDestroy {
  details: PokemonDetails;
  nextDisabled = true;
  previousDisabled = true;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data
      .subscribe((data: PokemonDetails) => {
        this.details = data;
        this.previousDisabled = data.id <= 1;
        this.nextDisabled = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPrevious() {
    this.disableButtons();
    this.router.navigate([this.details.id - 1]);
  }

  loadNext() {
    this.disableButtons();
    this.router.navigate([this.details.id + 1]);
  }

  private disableButtons() {
    this.previousDisabled = true;
    this.nextDisabled = true;
    this.changeDetectorRef.detectChanges();
  }
}
