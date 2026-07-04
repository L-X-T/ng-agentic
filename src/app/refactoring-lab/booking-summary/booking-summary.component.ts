import { Component, effect, input, signal } from '@angular/core';
import { Booking } from './booking.model';

@Component({
  selector: 'lxt-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss',
})
export class BookingSummaryComponent {
  readonly bookings = input<readonly Booking[]>([
    { id: 'B2', status: 'cancelled', label: 'Lin' },
    { id: 'B1', status: 'active', label: 'Ada' },
    { id: 'B3', status: 'active', label: 'Sam' },
  ]);

  protected readonly showActive = signal(false);
  protected readonly visibleBookings = signal<readonly Booking[]>([]);
  protected readonly visibleCount = signal(0);

  constructor() {
    // Deliberate Lab 07 debt: these values can be derived instead of synchronized.
    effect(() => {
      const visible = this.showActive()
        ? this.bookings().filter((booking) => booking.status === 'active')
        : this.bookings();
      this.visibleBookings.set(visible);
      this.visibleCount.set(visible.length);
    });
  }

  protected onShowActive(): void {
    this.showActive.set(true);
  }

  protected onShowAll(): void {
    this.showActive.set(false);
  }
}
