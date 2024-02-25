export type TCar = {
  model: string;
  make: string;
  slug: string;
  price: string;
  year: string;
  thumbnail: string;
  mileage?: string;
  engine_size?: string;
  sales_agent?: string;
  horse_power?: string;
  unified_string: string;
};

export interface Booking {
  totalOccupants: number;
  availableCalendarIds: string[];
  customerEmail: string;
  startTime: string;
  endTime: string;
}
