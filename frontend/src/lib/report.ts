import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Dashboard, Group, Medicine } from './api'

const GROUP_LABEL: Record<Group, string> = {
  expired: 'Expired',
  within30: 'Expiring ≤ 30 days',
  within90: 'Expiring ≤ 90 days',
  safe: 'Safe',
}

const GROUP_COLOR: Record<Group, [number, number, number]> = {
  expired: [253, 236, 236],
  within30: [253, 243, 225],
  within90: [232, 242, 250],
  safe: [228, 247, 240],
}

function taka(value: number): string {
  return `Tk ${value.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

function finalY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
}

export function generateStockReport(dashboard: Dashboard, items: Medicine[], opts?: { pharmacyName?: string }) {
  const pharmacyName = opts?.pharmacyName ?? 'Rahman Pharmacy'
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 157, 120)
  doc.text('MediTrack', margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 98, 112)
  doc.text('Stock Expiry Report', margin, y + 6)

  doc.setFontSize(9)
  doc.text(pharmacyName, pageWidth - margin, y, { align: 'right' })
  doc.text(`Generated ${new Date().toLocaleString('en-GB')}`, pageWidth - margin, y + 5, { align: 'right' })
  doc.text(`As of ${dashboard.today}`, pageWidth - margin, y + 10, { align: 'right' })

  y += 16
  doc.setDrawColor(228, 232, 238)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(16, 21, 29)
  doc.text('Executive Summary', margin, y)
  y += 6

  const totalAtRisk = dashboard.groups.expired.value + dashboard.groups.within30.value
  const totalItems = Object.values(dashboard.groups).reduce((s, g) => s + g.count, 0)
  const totalValue = Object.values(dashboard.groups).reduce((s, g) => s + g.value, 0)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(60, 68, 82)
  const summaryLine = `The pharmacy currently holds ${totalItems} active line items worth ${taka(totalValue)}. Of this, ${taka(
    totalAtRisk
  )} is at immediate risk of write-off — already expired or expiring within the next 30 days.`
  const wrapped = doc.splitTextToSize(summaryLine, pageWidth - margin * 2) as string[]
  doc.text(wrapped, margin, y)
  y += wrapped.length * 5 + 4

  const groupOrder: Group[] = ['expired', 'within30', 'within90', 'safe']
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Group', 'Items', 'Value at risk', '% of stock value']],
    body: groupOrder.map((g) => [
      GROUP_LABEL[g],
      String(dashboard.groups[g].count),
      taka(dashboard.groups[g].value),
      totalValue ? `${((dashboard.groups[g].value / totalValue) * 100).toFixed(1)}%` : '0%',
    ]),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [16, 23, 32], textColor: 255 },
    didParseCell: (data) => {
      if (data.section === 'body') {
        data.cell.styles.fillColor = GROUP_COLOR[groupOrder[data.row.index]]
      }
    },
  })
  y = finalY(doc) + 12

  const atRisk = items
    .filter((i) => i.group === 'expired' || i.group === 'within30')
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)

  if (atRisk.length) {
    if (y > 240) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(16, 21, 29)
    doc.text('Top Items by Value at Risk', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Medicine', 'Company', 'Batch', 'Qty', 'Unit price', 'Expiry', 'Days left', 'Value']],
      body: atRisk.map((i) => [
        i.name,
        i.company,
        i.batch,
        String(i.quantity),
        taka(i.unit_price_bdt),
        i.expiry,
        String(i.days_left),
        taka(i.value),
      ]),
      theme: 'striped',
      styles: { fontSize: 8.5, cellPadding: 2.5 },
      headStyles: { fillColor: [214, 69, 69] },
    })
    y = finalY(doc) + 12
  }

  const byCompany = new Map<string, { value: number; count: number }>()
  for (const i of items) {
    if (i.group !== 'expired' && i.group !== 'within30') continue
    const entry = byCompany.get(i.company) ?? { value: 0, count: 0 }
    entry.value += i.value
    entry.count += 1
    byCompany.set(i.company, entry)
  }
  const companyRows = [...byCompany.entries()].sort((a, b) => b[1].value - a[1].value).slice(0, 10)

  if (companyRows.length) {
    if (y > 240) {
      doc.addPage()
      y = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(16, 21, 29)
    doc.text('Value at Risk by Company', margin, y)
    y += 4
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Company', 'Items at risk', 'Value at risk']],
      body: companyRows.map(([company, v]) => [company, String(v.count), taka(v.value)]),
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [36, 113, 163] },
    })
  }

  doc.addPage()
  y = 20
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(16, 21, 29)
  doc.text('Full Active Stock Listing', margin, y)
  y += 4

  const sorted = [...items].sort((a, b) => a.expiry.localeCompare(b.expiry))
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Medicine', 'Company', 'Batch', 'Qty', 'Unit price', 'Expiry', 'Days left', 'Group', 'Value']],
    body: sorted.map((i) => [
      i.name,
      i.company,
      i.batch,
      String(i.quantity),
      taka(i.unit_price_bdt),
      i.expiry,
      String(i.days_left),
      GROUP_LABEL[i.group],
      taka(i.value),
    ]),
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.2 },
    headStyles: { fillColor: [16, 23, 32], textColor: 255 },
    didParseCell: (data) => {
      if (data.section === 'body') {
        const item = sorted[data.row.index]
        if (item) data.cell.styles.fillColor = GROUP_COLOR[item.group]
      }
    },
  })

  const pageCount = doc.getNumberOfPages()
  const pageHeight = doc.internal.pageSize.getHeight()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 158, 171)
    doc.text('Generated by MediTrack — for internal use', margin, pageHeight - 8)
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
  }

  doc.save(`stock-report-${dashboard.today}.pdf`)
}
