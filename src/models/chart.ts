export interface ChartData {
  x: string
  y: number
}

export interface ChartTooltipData {
  x: string
  y: string
}

export interface VeNewoChartData {
  id: string
  date: Date
  value: string
}

export enum SupplyType {
  VENEWO = 'venewo',
  LOCKED_NEWO = 'locked-newo',
}
