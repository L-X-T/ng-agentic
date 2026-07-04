export type Booking = {
  id: string;
  label: string;
  status: 'active' | 'cancelled' | 'pending';
};
