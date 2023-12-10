export interface AccionInterface {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string;
}

export interface ChartInterface {
  close: string;
  datetime: string;
  high: string;
  low: string;
  open: string;
  volume: string;
}

export interface ChartData {
  show: boolean;
  loading: boolean;
  error: boolean;
}
