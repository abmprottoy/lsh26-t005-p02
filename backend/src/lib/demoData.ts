export type DemoItem = {
  id: string
  name: string
  company: string
  batch: string
  quantity: number
  unit_price_bdt: number
  offsetDays: number
}

export const DEMO_ITEMS: DemoItem[] = [
  { id: 'M001', name: 'Napa 500', company: 'Beximco', batch: 'F7868', quantity: 211, unit_price_bdt: 1.5, offsetDays: -380 },
  { id: 'M002', name: 'Napa Extra', company: 'ACI', batch: 'E1520', quantity: 180, unit_price_bdt: 1.8, offsetDays: -120 },
  { id: 'M003', name: 'Seclo 20', company: 'ACI', batch: 'C4144', quantity: 95, unit_price_bdt: 5.5, offsetDays: -40 },
  { id: 'M004', name: 'Losectil 20', company: 'Beximco', batch: 'F1262', quantity: 146, unit_price_bdt: 8.5, offsetDays: -9 },
  { id: 'M005', name: 'Maxpro 20', company: 'Square', batch: 'C3532', quantity: 60, unit_price_bdt: 6.0, offsetDays: -3 },
  { id: 'M006', name: 'Ace 500', company: 'Healthcare', batch: 'G2425', quantity: 51, unit_price_bdt: 60.0, offsetDays: -1 },
  { id: 'M007', name: 'Fexo 120', company: 'Square', batch: 'F4545', quantity: 202, unit_price_bdt: 25.0, offsetDays: 0 },
  { id: 'M008', name: 'Monas 10', company: 'Healthcare', batch: 'H9382', quantity: 275, unit_price_bdt: 2.5, offsetDays: 2 },
  { id: 'M009', name: 'Zimax 500', company: 'Eskayef', batch: 'H6761', quantity: 157, unit_price_bdt: 5.0, offsetDays: 5 },
  { id: 'M010', name: 'Ciprocin 500', company: 'Square', batch: 'H9006', quantity: 207, unit_price_bdt: 4.5, offsetDays: 8 },
  { id: 'M011', name: 'Amodis 400', company: 'Popular', batch: 'H9386', quantity: 269, unit_price_bdt: 3.5, offsetDays: 11 },
  { id: 'M012', name: 'Flagyl 400', company: 'Healthcare', batch: 'G1498', quantity: 187, unit_price_bdt: 45.5, offsetDays: 14 },
  { id: 'M013', name: 'Histacin 4', company: 'Renata', batch: 'E4304', quantity: 171, unit_price_bdt: 12.0, offsetDays: 17 },
  { id: 'M014', name: 'Alatrol 10', company: 'Renata', batch: 'H1919', quantity: 171, unit_price_bdt: 3.5, offsetDays: 20 },
  { id: 'M015', name: 'Deslor 5', company: 'Square', batch: 'D5498', quantity: 105, unit_price_bdt: 5.0, offsetDays: 23 },
  { id: 'M016', name: 'Neotack 150', company: 'Opsonin', batch: 'D7149', quantity: 101, unit_price_bdt: 8.0, offsetDays: 27 },
  { id: 'M017', name: 'Napa 500', company: 'Square', batch: 'F2210', quantity: 320, unit_price_bdt: 1.4, offsetDays: 30 },
  { id: 'M018', name: 'Omidon 10', company: 'Beximco', batch: 'G3345', quantity: 140, unit_price_bdt: 2.0, offsetDays: 34 },
  { id: 'M019', name: 'Sergel 20', company: 'Healthcare', batch: 'H1122', quantity: 90, unit_price_bdt: 7.5, offsetDays: 41 },
  { id: 'M020', name: 'Rivotril 0.5', company: 'Popular', batch: 'E7789', quantity: 60, unit_price_bdt: 4.2, offsetDays: 48 },
  { id: 'M021', name: 'Esomac 20', company: 'ACI', batch: 'F5567', quantity: 130, unit_price_bdt: 6.8, offsetDays: 55 },
  { id: 'M022', name: 'Renova 10', company: 'Renata', batch: 'G8890', quantity: 88, unit_price_bdt: 9.5, offsetDays: 62 },
  { id: 'M023', name: 'Pantonix 20', company: 'Eskayef', batch: 'H2233', quantity: 175, unit_price_bdt: 3.9, offsetDays: 69 },
  { id: 'M024', name: 'Antipyra', company: 'Opsonin', batch: 'D9911', quantity: 210, unit_price_bdt: 1.2, offsetDays: 76 },
  { id: 'M025', name: 'Bicozin', company: 'Square', batch: 'F4488', quantity: 95, unit_price_bdt: 5.6, offsetDays: 83 },
  { id: 'M026', name: 'Cef-3', company: 'Beximco', batch: 'G6677', quantity: 60, unit_price_bdt: 55.0, offsetDays: 90 },
  { id: 'M027', name: 'Napa Extend', company: 'ACI', batch: 'H3344', quantity: 250, unit_price_bdt: 2.2, offsetDays: 110 },
  { id: 'M028', name: 'Ostocal D', company: 'Square', batch: 'D2299', quantity: 300, unit_price_bdt: 3.0, offsetDays: 140 },
  { id: 'M029', name: 'Rupise', company: 'Renata', batch: 'E6655', quantity: 175, unit_price_bdt: 8.9, offsetDays: 160 },
  { id: 'M030', name: 'Tabril 10', company: 'Healthcare', batch: 'F9922', quantity: 140, unit_price_bdt: 6.4, offsetDays: 190 },
  { id: 'M031', name: 'Vertin 16', company: 'Beximco', batch: 'G1188', quantity: 90, unit_price_bdt: 12.5, offsetDays: 210 },
  { id: 'M032', name: 'Xylo Nasal', company: 'Opsonin', batch: 'H5566', quantity: 60, unit_price_bdt: 40.0, offsetDays: 240 },
  { id: 'M033', name: 'Yasmin 21', company: 'ACI', batch: 'D8877', quantity: 45, unit_price_bdt: 220.0, offsetDays: 270 },
  { id: 'M034', name: 'Zoline', company: 'Square', batch: 'E2244', quantity: 130, unit_price_bdt: 15.0, offsetDays: 300 },
  { id: 'M035', name: 'Aristozyme', company: 'Renata', batch: 'F6633', quantity: 80, unit_price_bdt: 130.0, offsetDays: 330 },
  { id: 'M036', name: 'Brozeet', company: 'Eskayef', batch: 'G9955', quantity: 220, unit_price_bdt: 3.3, offsetDays: 365 },
  { id: 'M037', name: 'Ciprocin 250', company: 'Square', batch: 'H4411', quantity: 190, unit_price_bdt: 3.2, offsetDays: 400 },
  { id: 'M038', name: 'Domex', company: 'Healthcare', batch: 'D5522', quantity: 70, unit_price_bdt: 4.7, offsetDays: 430 },
  { id: 'M039', name: 'Emistat 4', company: 'Beximco', batch: 'E9988', quantity: 55, unit_price_bdt: 11.0, offsetDays: 460 },
  { id: 'M040', name: 'Fenadin 60', company: 'Opsonin', batch: 'F3300', quantity: 160, unit_price_bdt: 2.8, offsetDays: 490 },
  { id: 'M041', name: 'Glucored Forte', company: 'Popular', batch: 'G7744', quantity: 95, unit_price_bdt: 6.9, offsetDays: 520 },
  { id: 'M042', name: 'Histalex', company: 'Renata', batch: 'H8822', quantity: 130, unit_price_bdt: 4.1, offsetDays: 550 },
  { id: 'M043', name: 'Ivotas 400', company: 'ACI', batch: 'D1166', quantity: 60, unit_price_bdt: 9.9, offsetDays: 580 },
  { id: 'M044', name: 'Junex', company: 'Square', batch: 'E4477', quantity: 200, unit_price_bdt: 1.9, offsetDays: 610 },
  { id: 'M045', name: 'Ketamex', company: 'Eskayef', batch: 'F8811', quantity: 75, unit_price_bdt: 18.5, offsetDays: 650 },
  { id: 'M046', name: 'Losectil 40', company: 'Beximco', batch: 'G2266', quantity: 110, unit_price_bdt: 13.5, offsetDays: 690 },
]

export function demoItemsAsOf(today: string) {
  const [y, m, d] = today.split('-').map(Number)
  const base = Date.UTC(y, m - 1, d)
  return DEMO_ITEMS.map((item) => {
    const expiryDate = new Date(base + item.offsetDays * 86_400_000)
    const expiry = expiryDate.toISOString().slice(0, 10)
    return {
      id: item.id,
      name: item.name,
      company: item.company,
      batch: item.batch,
      quantity: item.quantity,
      unit_price_bdt: item.unit_price_bdt,
      expiry,
    }
  })
}
