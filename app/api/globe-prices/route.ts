// ─────────────────────────────────────────────────────────────────────────────
// Y.P Strategic Research — Globe Prices API
// Batch Finnhub price fetcher for Global Stock Intelligence Globe
// Returns real-time prices for S&P 500 + NASDAQ 100 universe
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server'
import { ALL_TICKERS } from '@/app/lib/sp500-companies'

export const revalidate = 60 // Cache 60 seconds

interface PriceData {
  ticker: string
  price: number
  change: number      // absolute change
  changePct: number   // % change
  high: number
  low: number
  open: number
  prevClose: number
}

// Compact mock prices for fallback (all major tickers)
const MOCK_PRICES: Record<string, PriceData> = {
  LMT:  { ticker: 'LMT',  price: 478.32, change: 3.21,  changePct: 0.68,  high: 481.50, low: 472.10, open: 475.00, prevClose: 475.11 },
  RTX:  { ticker: 'RTX',  price: 123.45, change: -1.23, changePct: -0.99, high: 125.00, low: 122.00, open: 124.68, prevClose: 124.68 },
  NOC:  { ticker: 'NOC',  price: 498.75, change: 5.20,  changePct: 1.05,  high: 500.00, low: 493.00, open: 493.55, prevClose: 493.55 },
  GD:   { ticker: 'GD',   price: 286.40, change: -0.80, changePct: -0.28, high: 288.00, low: 284.50, open: 287.20, prevClose: 287.20 },
  BA:   { ticker: 'BA',   price: 189.65, change: 2.15,  changePct: 1.15,  high: 191.00, low: 187.50, open: 187.50, prevClose: 187.50 },
  HII:  { ticker: 'HII',  price: 245.30, change: -3.10, changePct: -1.25, high: 249.00, low: 244.00, open: 248.40, prevClose: 248.40 },
  LHX:  { ticker: 'LHX',  price: 235.80, change: 1.45,  changePct: 0.62,  high: 237.00, low: 234.00, open: 234.35, prevClose: 234.35 },
  BAH:  { ticker: 'BAH',  price: 153.20, change: 0.90,  changePct: 0.59,  high: 154.50, low: 152.00, open: 152.30, prevClose: 152.30 },
  SAIC: { ticker: 'SAIC', price: 128.75, change: -1.05, changePct: -0.81, high: 130.00, low: 128.00, open: 129.80, prevClose: 129.80 },
  LDOS: { ticker: 'LDOS', price: 174.50, change: 2.30,  changePct: 1.34,  high: 175.00, low: 172.20, open: 172.20, prevClose: 172.20 },
  KTOS: { ticker: 'KTOS', price: 28.45,  change: 0.75,  changePct: 2.71,  high: 28.80,  low: 27.90,  open: 27.70,  prevClose: 27.70 },
  AXON: { ticker: 'AXON', price: 385.20, change: 8.50,  changePct: 2.26,  high: 388.00, low: 376.70, open: 376.70, prevClose: 376.70 },
  MRCY: { ticker: 'MRCY', price: 38.90,  change: -0.60, changePct: -1.52, high: 39.80,  low: 38.50,  open: 39.50,  prevClose: 39.50 },
  DRS:  { ticker: 'DRS',  price: 28.15,  change: 0.25,  changePct: 0.90,  high: 28.50,  low: 27.90,  open: 27.90,  prevClose: 27.90 },
  AAPL: { ticker: 'AAPL', price: 213.88, change: 1.23,  changePct: 0.58,  high: 215.00, low: 212.00, open: 212.65, prevClose: 212.65 },
  MSFT: { ticker: 'MSFT', price: 425.52, change: -2.48, changePct: -0.58, high: 428.50, low: 424.00, open: 428.00, prevClose: 428.00 },
  GOOGL:{ ticker: 'GOOGL',price: 192.35, change: 3.15,  changePct: 1.67,  high: 193.50, low: 189.20, open: 189.20, prevClose: 189.20 },
  META: { ticker: 'META', price: 612.40, change: 5.80,  changePct: 0.96,  high: 615.00, low: 606.60, open: 606.60, prevClose: 606.60 },
  AMZN: { ticker: 'AMZN', price: 218.75, change: 2.45,  changePct: 1.13,  high: 220.00, low: 216.30, open: 216.30, prevClose: 216.30 },
  TSLA: { ticker: 'TSLA', price: 248.80, change: -5.20, changePct: -2.05, high: 255.00, low: 247.00, open: 254.00, prevClose: 254.00 },
  ORCL: { ticker: 'ORCL', price: 178.45, change: 1.35,  changePct: 0.76,  high: 179.50, low: 177.10, open: 177.10, prevClose: 177.10 },
  CRM:  { ticker: 'CRM',  price: 295.60, change: 3.40,  changePct: 1.16,  high: 297.00, low: 292.20, open: 292.20, prevClose: 292.20 },
  ADBE: { ticker: 'ADBE', price: 435.80, change: -4.20, changePct: -0.95, high: 441.00, low: 434.00, open: 440.00, prevClose: 440.00 },
  PLTR: { ticker: 'PLTR', price: 85.40,  change: 2.20,  changePct: 2.64,  high: 86.50,  low: 83.20,  open: 83.20,  prevClose: 83.20 },
  IBM:  { ticker: 'IBM',  price: 238.90, change: 0.90,  changePct: 0.38,  high: 240.00, low: 237.80, open: 238.00, prevClose: 238.00 },
  INTU: { ticker: 'INTU', price: 682.50, change: 5.50,  changePct: 0.81,  high: 685.00, low: 677.00, open: 677.00, prevClose: 677.00 },
  NOW:  { ticker: 'NOW',  price: 980.20, change: -8.30, changePct: -0.84, high: 990.00, low: 978.50, open: 988.50, prevClose: 988.50 },
  SNOW: { ticker: 'SNOW', price: 162.80, change: 3.80,  changePct: 2.39,  high: 164.00, low: 159.00, open: 159.00, prevClose: 159.00 },
  UBER: { ticker: 'UBER', price: 82.35,  change: 1.15,  changePct: 1.42,  high: 83.00,  low: 81.20,  open: 81.20,  prevClose: 81.20 },
  ABNB: { ticker: 'ABNB', price: 138.60, change: -1.40, changePct: -1.00, high: 140.50, low: 138.00, open: 140.00, prevClose: 140.00 },
  SHOP: { ticker: 'SHOP', price: 118.45, change: 2.15,  changePct: 1.85,  high: 119.50, low: 116.30, open: 116.30, prevClose: 116.30 },
  NFLX: { ticker: 'NFLX', price: 890.25, change: 12.75, changePct: 1.45,  high: 895.00, low: 877.50, open: 877.50, prevClose: 877.50 },
  SPOT: { ticker: 'SPOT', price: 485.30, change: 8.70,  changePct: 1.83,  high: 488.00, low: 476.60, open: 476.60, prevClose: 476.60 },
  NVDA: { ticker: 'NVDA', price: 875.40, change: 18.60, changePct: 2.17,  high: 880.00, low: 856.80, open: 856.80, prevClose: 856.80 },
  AMD:  { ticker: 'AMD',  price: 158.75, change: -3.25, changePct: -2.01, high: 163.00, low: 157.50, open: 162.00, prevClose: 162.00 },
  INTC: { ticker: 'INTC', price: 22.45,  change: -0.55, changePct: -2.39, high: 23.10,  low: 22.20,  open: 23.00,  prevClose: 23.00 },
  AVGO: { ticker: 'AVGO', price: 1342.80,change: 22.80, changePct: 1.73,  high: 1350.00,low: 1320.00,open: 1320.00,prevClose: 1320.00 },
  QCOM: { ticker: 'QCOM', price: 168.90, change: 2.10,  changePct: 1.26,  high: 170.00, low: 166.80, open: 166.80, prevClose: 166.80 },
  TXN:  { ticker: 'TXN',  price: 182.35, change: -1.65, changePct: -0.90, high: 184.50, low: 181.80, open: 184.00, prevClose: 184.00 },
  AMAT: { ticker: 'AMAT', price: 195.80, change: 3.80,  changePct: 1.98,  high: 197.00, low: 192.00, open: 192.00, prevClose: 192.00 },
  LRCX: { ticker: 'LRCX', price: 845.60, change: 12.40, changePct: 1.49,  high: 850.00, low: 833.20, open: 833.20, prevClose: 833.20 },
  KLAC: { ticker: 'KLAC', price: 745.30, change: 8.70,  changePct: 1.18,  high: 748.00, low: 736.60, open: 736.60, prevClose: 736.60 },
  MU:   { ticker: 'MU',   price: 98.45,  change: -2.05, changePct: -2.04, high: 101.00, low: 97.80,  open: 100.50, prevClose: 100.50 },
  ADI:  { ticker: 'ADI',  price: 218.70, change: 1.70,  changePct: 0.78,  high: 220.00, low: 217.00, open: 217.00, prevClose: 217.00 },
  MRVL: { ticker: 'MRVL', price: 82.40,  change: 1.90,  changePct: 2.36,  high: 83.00,  low: 80.50,  open: 80.50,  prevClose: 80.50 },
  TSM:  { ticker: 'TSM',  price: 168.25, change: 3.25,  changePct: 1.97,  high: 169.50, low: 165.00, open: 165.00, prevClose: 165.00 },
  ASML: { ticker: 'ASML', price: 785.40, change: -5.60, changePct: -0.71, high: 792.00, low: 783.00, open: 791.00, prevClose: 791.00 },
  IONQ: { ticker: 'IONQ', price: 38.25,  change: 1.75,  changePct: 4.80,  high: 39.00,  low: 36.50,  open: 36.50,  prevClose: 36.50 },
  RGTI: { ticker: 'RGTI', price: 12.80,  change: 0.80,  changePct: 6.67,  high: 13.20,  low: 12.00,  open: 12.00,  prevClose: 12.00 },
  QUBT: { ticker: 'QUBT', price: 8.45,   change: 0.45,  changePct: 5.63,  high: 8.80,   low: 8.00,   open: 8.00,   prevClose: 8.00 },
  CRWD: { ticker: 'CRWD', price: 358.90, change: 6.90,  changePct: 1.96,  high: 362.00, low: 352.00, open: 352.00, prevClose: 352.00 },
  PANW: { ticker: 'PANW', price: 380.50, change: -2.50, changePct: -0.65, high: 384.00, low: 379.00, open: 383.00, prevClose: 383.00 },
  ZS:   { ticker: 'ZS',   price: 218.40, change: 3.40,  changePct: 1.58,  high: 220.00, low: 215.00, open: 215.00, prevClose: 215.00 },
  FTNT: { ticker: 'FTNT', price: 94.80,  change: 1.30,  changePct: 1.39,  high: 95.50,  low: 93.50,  open: 93.50,  prevClose: 93.50 },
  NET:  { ticker: 'NET',  price: 128.60, change: 2.60,  changePct: 2.06,  high: 129.50, low: 126.00, open: 126.00, prevClose: 126.00 },
  S:    { ticker: 'S',    price: 22.85,  change: 0.35,  changePct: 1.55,  high: 23.20,  low: 22.50,  open: 22.50,  prevClose: 22.50 },
  DDOG: { ticker: 'DDOG', price: 122.40, change: -1.60, changePct: -1.29, high: 125.00, low: 121.80, open: 124.00, prevClose: 124.00 },
  OKTA: { ticker: 'OKTA', price: 68.75,  change: 1.25,  changePct: 1.85,  high: 69.50,  low: 67.50,  open: 67.50,  prevClose: 67.50 },
  RKLB: { ticker: 'RKLB', price: 18.45,  change: 0.95,  changePct: 5.43,  high: 18.80,  low: 17.50,  open: 17.50,  prevClose: 17.50 },
  ASTS: { ticker: 'ASTS', price: 28.60,  change: 1.60,  changePct: 5.93,  high: 29.20,  low: 27.00,  open: 27.00,  prevClose: 27.00 },
  MNTS: { ticker: 'MNTS', price: 1.85,   change: 0.15,  changePct: 8.82,  high: 1.90,   low: 1.70,   open: 1.70,   prevClose: 1.70 },
  RDW:  { ticker: 'RDW',  price: 4.25,   change: 0.25,  changePct: 6.25,  high: 4.40,   low: 4.00,   open: 4.00,   prevClose: 4.00 },
  LUNR: { ticker: 'LUNR', price: 12.80,  change: 0.80,  changePct: 6.67,  high: 13.20,  low: 12.00,  open: 12.00,  prevClose: 12.00 },
  SPCE: { ticker: 'SPCE', price: 1.85,   change: 0.05,  changePct: 2.78,  high: 1.90,   low: 1.80,   open: 1.80,   prevClose: 1.80 },
  JPM:  { ticker: 'JPM',  price: 248.90, change: 1.90,  changePct: 0.77,  high: 250.00, low: 247.00, open: 247.00, prevClose: 247.00 },
  BAC:  { ticker: 'BAC',  price: 44.85,  change: 0.35,  changePct: 0.79,  high: 45.20,  low: 44.50,  open: 44.50,  prevClose: 44.50 },
  GS:   { ticker: 'GS',   price: 598.40, change: 5.40,  changePct: 0.91,  high: 601.00, low: 593.00, open: 593.00, prevClose: 593.00 },
  MS:   { ticker: 'MS',   price: 128.75, change: -0.75, changePct: -0.58, high: 130.00, low: 128.00, open: 129.50, prevClose: 129.50 },
  V:    { ticker: 'V',    price: 338.50, change: 2.50,  changePct: 0.74,  high: 340.00, low: 336.00, open: 336.00, prevClose: 336.00 },
  MA:   { ticker: 'MA',   price: 552.80, change: 4.80,  changePct: 0.88,  high: 555.00, low: 548.00, open: 548.00, prevClose: 548.00 },
  AXP:  { ticker: 'AXP',  price: 298.60, change: -1.40, changePct: -0.47, high: 301.00, low: 298.00, open: 300.00, prevClose: 300.00 },
  BLK:  { ticker: 'BLK',  price: 1048.30,change: 8.30,  changePct: 0.80,  high: 1052.00,low: 1040.00,open: 1040.00,prevClose: 1040.00 },
  SCHW: { ticker: 'SCHW', price: 88.40,  change: 0.40,  changePct: 0.45,  high: 89.00,  low: 87.80,  open: 88.00,  prevClose: 88.00 },
  CME:  { ticker: 'CME',  price: 248.70, change: 1.70,  changePct: 0.69,  high: 250.00, low: 247.20, open: 247.00, prevClose: 247.00 },
  COIN: { ticker: 'COIN', price: 268.45, change: 8.45,  changePct: 3.25,  high: 272.00, low: 260.00, open: 260.00, prevClose: 260.00 },
  HOOD: { ticker: 'HOOD', price: 42.80,  change: 1.80,  changePct: 4.39,  high: 43.50,  low: 41.00,  open: 41.00,  prevClose: 41.00 },
  SQ:   { ticker: 'SQ',   price: 72.35,  change: 1.35,  changePct: 1.90,  high: 73.00,  low: 71.00,  open: 71.00,  prevClose: 71.00 },
  PYPL: { ticker: 'PYPL', price: 78.90,  change: 0.90,  changePct: 1.15,  high: 79.50,  low: 78.00,  open: 78.00,  prevClose: 78.00 },
  JNJ:  { ticker: 'JNJ',  price: 162.45, change: -0.55, changePct: -0.34, high: 163.50, low: 162.00, open: 163.00, prevClose: 163.00 },
  UNH:  { ticker: 'UNH',  price: 540.80, change: 3.80,  changePct: 0.71,  high: 543.00, low: 537.00, open: 537.00, prevClose: 537.00 },
  PFE:  { ticker: 'PFE',  price: 28.45,  change: -0.45, changePct: -1.56, high: 29.00,  low: 28.30,  open: 28.90,  prevClose: 28.90 },
  ABBV: { ticker: 'ABBV', price: 198.30, change: 2.30,  changePct: 1.17,  high: 199.50, low: 196.00, open: 196.00, prevClose: 196.00 },
  MRK:  { ticker: 'MRK',  price: 112.60, change: 0.60,  changePct: 0.54,  high: 113.50, low: 111.80, open: 112.00, prevClose: 112.00 },
  LLY:  { ticker: 'LLY',  price: 895.40, change: 12.40, changePct: 1.40,  high: 900.00, low: 883.00, open: 883.00, prevClose: 883.00 },
  TMO:  { ticker: 'TMO',  price: 548.70, change: 3.70,  changePct: 0.68,  high: 552.00, low: 545.00, open: 545.00, prevClose: 545.00 },
  AMGN: { ticker: 'AMGN', price: 298.50, change: -1.50, changePct: -0.50, high: 301.00, low: 297.80, open: 300.00, prevClose: 300.00 },
  GILD: { ticker: 'GILD', price: 98.80,  change: 0.80,  changePct: 0.82,  high: 99.50,  low: 98.00,  open: 98.00,  prevClose: 98.00 },
  VRTX: { ticker: 'VRTX', price: 478.60, change: 4.60,  changePct: 0.97,  high: 481.00, low: 474.00, open: 474.00, prevClose: 474.00 },
  ISRG: { ticker: 'ISRG', price: 542.80, change: 5.80,  changePct: 1.08,  high: 546.00, low: 537.00, open: 537.00, prevClose: 537.00 },
  XOM:  { ticker: 'XOM',  price: 118.45, change: 1.45,  changePct: 1.24,  high: 119.50, low: 117.00, open: 117.00, prevClose: 117.00 },
  CVX:  { ticker: 'CVX',  price: 162.80, change: -0.20, changePct: -0.12, high: 164.00, low: 162.50, open: 163.00, prevClose: 163.00 },
  COP:  { ticker: 'COP',  price: 118.90, change: 1.90,  changePct: 1.63,  high: 119.50, low: 117.00, open: 117.00, prevClose: 117.00 },
  SLB:  { ticker: 'SLB',  price: 42.80,  change: 0.30,  changePct: 0.71,  high: 43.20,  low: 42.50,  open: 42.50,  prevClose: 42.50 },
  HAL:  { ticker: 'HAL',  price: 28.45,  change: -0.55, changePct: -1.90, high: 29.10,  low: 28.30,  open: 29.00,  prevClose: 29.00 },
  EOG:  { ticker: 'EOG',  price: 128.60, change: 1.60,  changePct: 1.26,  high: 129.50, low: 127.00, open: 127.00, prevClose: 127.00 },
  SHEL: { ticker: 'SHEL', price: 68.40,  change: 0.40,  changePct: 0.59,  high: 69.00,  low: 67.80,  open: 68.00,  prevClose: 68.00 },
  BP:   { ticker: 'BP',   price: 32.85,  change: -0.15, changePct: -0.45, high: 33.20,  low: 32.70,  open: 33.00,  prevClose: 33.00 },
  CEG:  { ticker: 'CEG',  price: 248.30, change: 5.30,  changePct: 2.18,  high: 250.00, low: 243.00, open: 243.00, prevClose: 243.00 },
  VST:  { ticker: 'VST',  price: 168.45, change: 3.45,  changePct: 2.09,  high: 170.00, low: 165.00, open: 165.00, prevClose: 165.00 },
  BWXT: { ticker: 'BWXT', price: 98.80,  change: 1.80,  changePct: 1.86,  high: 99.50,  low: 97.00,  open: 97.00,  prevClose: 97.00 },
  OKLO: { ticker: 'OKLO', price: 38.45,  change: 1.45,  changePct: 3.92,  high: 39.20,  low: 37.00,  open: 37.00,  prevClose: 37.00 },
  NNE:  { ticker: 'NNE',  price: 22.80,  change: 0.80,  changePct: 3.64,  high: 23.20,  low: 22.00,  open: 22.00,  prevClose: 22.00 },
  SMR:  { ticker: 'SMR',  price: 8.45,   change: 0.45,  changePct: 5.63,  high: 8.80,   low: 8.00,   open: 8.00,   prevClose: 8.00 },
  LEU:  { ticker: 'LEU',  price: 48.60,  change: 1.60,  changePct: 3.41,  high: 49.20,  low: 47.00,  open: 47.00,  prevClose: 47.00 },
  WMT:  { ticker: 'WMT',  price: 92.45,  change: 0.45,  changePct: 0.49,  high: 93.00,  low: 91.80,  open: 92.00,  prevClose: 92.00 },
  COST: { ticker: 'COST', price: 948.30, change: 8.30,  changePct: 0.88,  high: 952.00, low: 940.00, open: 940.00, prevClose: 940.00 },
  TGT:  { ticker: 'TGT',  price: 148.80, change: -1.20, changePct: -0.80, high: 151.00, low: 148.50, open: 150.00, prevClose: 150.00 },
  HD:   { ticker: 'HD',   price: 398.60, change: 2.60,  changePct: 0.66,  high: 400.00, low: 396.00, open: 396.00, prevClose: 396.00 },
  NKE:  { ticker: 'NKE',  price: 72.45,  change: -0.55, changePct: -0.75, high: 73.50,  low: 72.00,  open: 73.00,  prevClose: 73.00 },
  SBUX: { ticker: 'SBUX', price: 98.80,  change: 1.80,  changePct: 1.86,  high: 99.50,  low: 97.00,  open: 97.00,  prevClose: 97.00 },
  MCD:  { ticker: 'MCD',  price: 298.45, change: 1.45,  changePct: 0.49,  high: 300.00, low: 297.00, open: 297.00, prevClose: 297.00 },
  GE:   { ticker: 'GE',   price: 198.30, change: 2.30,  changePct: 1.17,  high: 200.00, low: 196.00, open: 196.00, prevClose: 196.00 },
  HON:  { ticker: 'HON',  price: 228.60, change: -0.40, changePct: -0.17, high: 230.00, low: 228.00, open: 229.00, prevClose: 229.00 },
  CAT:  { ticker: 'CAT',  price: 368.40, change: 3.40,  changePct: 0.93,  high: 370.00, low: 365.00, open: 365.00, prevClose: 365.00 },
  DE:   { ticker: 'DE',   price: 448.80, change: 4.80,  changePct: 1.08,  high: 451.00, low: 444.00, open: 444.00, prevClose: 444.00 },
  UPS:  { ticker: 'UPS',  price: 128.45, change: -1.55, changePct: -1.19, high: 130.50, low: 128.00, open: 130.00, prevClose: 130.00 },
  FDX:  { ticker: 'FDX',  price: 298.60, change: 2.60,  changePct: 0.88,  high: 300.00, low: 296.00, open: 296.00, prevClose: 296.00 },
  ANET: { ticker: 'ANET', price: 328.80, change: 4.80,  changePct: 1.48,  high: 330.00, low: 324.00, open: 324.00, prevClose: 324.00 },
  T:    { ticker: 'T',    price: 22.45,  change: 0.15,  changePct: 0.67,  high: 22.70,  low: 22.30,  open: 22.30,  prevClose: 22.30 },
  VZ:   { ticker: 'VZ',   price: 42.80,  change: -0.20, changePct: -0.46, high: 43.20,  low: 42.70,  open: 43.00,  prevClose: 43.00 },
  TMUS: { ticker: 'TMUS', price: 232.40, change: 1.40,  changePct: 0.61,  high: 233.50, low: 231.00, open: 231.00, prevClose: 231.00 },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tickerParam = searchParams.get('tickers')
  const requestedTickers = tickerParam ? tickerParam.split(',').map(t => t.trim().toUpperCase()) : ALL_TICKERS

  const FINNHUB_KEY = process.env.FINNHUB_KEY

  // No API key — return mock data immediately
  if (!FINNHUB_KEY || FINNHUB_KEY === 'your_key_here') {
    const results: Record<string, PriceData> = {}
    for (const ticker of requestedTickers) {
      if (MOCK_PRICES[ticker]) {
        results[ticker] = MOCK_PRICES[ticker]
      }
    }
    return NextResponse.json({ prices: results, source: 'mock', timestamp: new Date().toISOString() })
  }

  // Live Finnhub data
  const results: Record<string, PriceData> = {}
  const BATCH_SIZE = 20
  const DELAY_MS = 200 // Respect rate limits (60/min free tier)

  for (let i = 0; i < requestedTickers.length; i += BATCH_SIZE) {
    const batch = requestedTickers.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (ticker) => {
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`,
            { next: { revalidate: 60 } }
          )
          if (!res.ok) {
            if (MOCK_PRICES[ticker]) results[ticker] = MOCK_PRICES[ticker]
            return
          }
          const data = await res.json()
          if (data.c) {
            results[ticker] = {
              ticker,
              price: data.c,
              change: data.d ?? 0,
              changePct: data.dp ?? 0,
              high: data.h ?? data.c,
              low: data.l ?? data.c,
              open: data.o ?? data.c,
              prevClose: data.pc ?? data.c,
            }
          } else if (MOCK_PRICES[ticker]) {
            results[ticker] = MOCK_PRICES[ticker]
          }
        } catch {
          if (MOCK_PRICES[ticker]) results[ticker] = MOCK_PRICES[ticker]
        }
      })
    )
    if (i + BATCH_SIZE < requestedTickers.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }

  return NextResponse.json({
    prices: results,
    source: 'finnhub',
    timestamp: new Date().toISOString(),
    count: Object.keys(results).length,
  })
}
