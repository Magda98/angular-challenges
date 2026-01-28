import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DOCUMENT,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, startWith, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';

@Component({
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <main class="flex h-screen items-center justify-center">
      <div
        class="flex w-full max-w-screen-sm flex-col items-center gap-y-8 p-4">
        <button
          (mouseup)="releaseButton()"
          (mousedown)="holdButton()"
          (mouseleave)="releaseButton()"
          class="rounded bg-indigo-600 px-4 py-2 font-bold text-white transition-colors ease-in-out hover:bg-indigo-700">
          Hold me
        </button>

        <progress [value]="progressValue" [max]="100"></progress>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly holdTimeout = 3000;
  private readonly progressInterval = 10;
  protected progressValue = 0;
  protected cdRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  protected document = inject(DOCUMENT);
  protected holdButtonSubject$ = new Subject<boolean>();
  protected progressReset$ = this.holdButtonSubject$
    .asObservable()
    .pipe(
      tap((isHolding) => {
        if (!isHolding) {
          this.progressValue = 0;
          this.cdRef.markForCheck();
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe();

  holdButton() {
    this.holdButtonSubject$.next(true);
    of()
      .pipe(
        startWith(0),
        switchMap(() =>
          timer(0, this.progressInterval).pipe(
            takeUntil(this.holdButtonSubject$),
          ),
        ),
        tap((val) => {
          this.progressValue =
            ((val * this.progressInterval) / this.holdTimeout) * 100;
          this.cdRef.markForCheck();
          if (this.progressValue > 100) {
            this.onSend();
            this.releaseButton();
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  releaseButton() {
    this.holdButtonSubject$.next(false);
  }

  onSend() {
    console.log('Save it!');
  }
}
