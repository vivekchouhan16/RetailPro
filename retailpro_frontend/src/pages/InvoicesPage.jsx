import { useEffect, useState } from 'react'
import { MdReceipt, MdSearch, MdVisibility } from 'react-icons/md'
import api from '../services/api'
import { PageHeader, Button, Modal, Table, Th, Td, Badge, Spinner, EmptyState } from '../components/ui'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function InvoiceDetail({ invoice }) {
  if (!invoice) return null
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded p-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Invoice #</p>
          <p className="font-semibold text-gray-800 font-mono">{invoice.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-medium text-gray-800">{formatDate(invoice.invoiceDate)}</p>
          <p className="text-xs text-gray-400">{formatTime(invoice.invoiceDate)}</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Product</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Price</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-700">{item.productName}</td>
                <td className="px-3 py-2 text-right text-gray-600">{item.quantity}</td>
                <td className="px-3 py-2 text-right text-gray-600">₹{item.unitPrice.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-medium text-gray-800">₹{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td colSpan={3} className="px-3 py-2 text-right font-semibold text-gray-800">Grand Total</td>
              <td className="px-3 py-2 text-right font-bold text-green-600">₹{invoice.grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewInvoice, setViewInvoice] = useState(null)

  useEffect(() => {
    api.get('/invoices')
      .then(res => { const data = res.data.data || res.data; setInvoices(data); setFiltered(data) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(q) || formatDate(inv.invoiceDate).toLowerCase().includes(q)
    ))
  }, [search, invoices])

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0)

  return (
    <div>
      <PageHeader title="Invoice History" subtitle="View all past transactions" />

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="text-xs text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">{invoices.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-0.5">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-3">
          <p className="text-xs text-gray-500">Avg. Invoice</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">
            ₹{invoices.length ? Math.round(totalRevenue / invoices.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded p-3 mb-4">
        <div className="relative max-w-xs">
          <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search by invoice # or date..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner className="text-blue-600 w-6 h-6" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded">
          <EmptyState icon={MdReceipt} title="No invoices found"
            description={search ? 'Try a different search' : 'Go to Billing to create your first invoice'} />
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Invoice Number</Th>
              <Th>Date</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, idx) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <Td className="w-10 text-gray-400 text-xs">{idx + 1}</Td>
                <Td><span className="font-mono text-sm text-gray-800">{inv.invoiceNumber}</span></Td>
                <Td>
                  <p className="text-sm text-gray-700">{formatDate(inv.invoiceDate)}</p>
                  <p className="text-xs text-gray-400">{formatTime(inv.invoiceDate)}</p>
                </Td>
                <Td><Badge variant="info">{inv.items?.length ?? '—'} items</Badge></Td>
                <Td><span className="font-semibold text-green-600">₹{inv.grandTotal.toLocaleString()}</span></Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setViewInvoice(inv)}>
                    <MdVisibility className="text-sm" /> View
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal open={!!viewInvoice} onClose={() => setViewInvoice(null)}
        title={`Invoice: ${viewInvoice?.invoiceNumber}`} maxWidth="max-w-lg">
        <InvoiceDetail invoice={viewInvoice} />
      </Modal>
    </div>
  )
}
