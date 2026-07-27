import { useEffect, useState } from 'react'
import { MdAdd, MdRemove, MdDelete, MdSearch, MdShoppingCart, MdReceipt, MdCheckCircle } from 'react-icons/md'
import api from '../services/api'
import { PageHeader, Button, Badge, Spinner, Alert, Modal } from '../components/ui'

function InvoiceSuccess({ invoice, onClose }) {
  return (
    <div className="text-center py-2">
      <MdCheckCircle className="text-green-600 text-4xl mx-auto mb-2" />
      <h3 className="text-base font-semibold text-gray-800">Invoice Generated!</h3>
      <p className="text-gray-500 text-sm">Invoice #{invoice.invoiceNumber}</p>

      <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-4 text-left space-y-1.5">
        {invoice.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.productName} × {item.quantity}</span>
            <span className="font-medium text-gray-800">₹{item.subtotal.toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-800">
          <span>Grand Total</span>
          <span className="text-green-600">₹{invoice.grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <Button onClick={onClose} className="mt-4 w-full justify-center">New Invoice</Button>
    </div>
  )
}

export default function BillingPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successInvoice, setSuccessInvoice] = useState(null)

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.data || res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stockQuantity > 0
  )

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { productId: product.id, quantity: 1, name: product.name, price: product.price, maxQty: product.stockQuantity }]
    })
  }

  const updateQty = (productId, delta) => {
    setCart(prev => prev
      .map(i => i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, i.maxQty)) } : i)
    )
  }

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId))
  const grandTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleGenerateInvoice = async () => {
    if (cart.length === 0) { setError('Add at least one product to the cart'); return }
    setSubmitting(true); setError('')
    try {
      const res = await api.post('/invoices', { items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })) })
      const invoice = res.data.data || res.data
      setSuccessInvoice(invoice)
      setCart([])
      const pRes = await api.get('/products')
      setProducts(pRes.data.data || pRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invoice')
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <PageHeader title="Billing" subtitle="Create a new invoice" />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Product list */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Products</p>
            <div className="relative mb-3">
              <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search products..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Spinner className="text-blue-600" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {filtered.map(product => {
                  const inCart = cart.find(i => i.productId === product.id)
                  return (
                    <button key={product.id} onClick={() => addToCart(product)}
                      className={`text-left p-3 rounded border transition-colors relative ${inCart ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}>
                      {inCart && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                          {inCart.quantity}
                        </span>
                      )}
                      <p className="font-medium text-gray-800 text-sm pr-6">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.categoryName}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-blue-600 font-semibold text-sm">₹{product.price.toLocaleString()}</span>
                        <Badge variant={product.stockQuantity <= 5 ? 'warning' : 'success'}>
                          {product.stockQuantity} left
                        </Badge>
                      </div>
                    </button>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-400 text-sm">No products available</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MdShoppingCart className="text-blue-600" /> Cart
              </p>
              {cart.length > 0 && <Badge variant="info">{cart.length} item(s)</Badge>}
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">Cart is empty</p>
            ) : (
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate text-xs">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => updateQty(item.productId, -1)}
                        className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <MdRemove className="text-xs" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)}
                        className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">
                        <MdAdd className="text-xs" />
                      </button>
                      <button onClick={() => removeFromCart(item.productId)}
                        className="w-5 h-5 flex items-center justify-center text-red-400 hover:bg-red-50 rounded ml-1">
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-sm font-semibold text-gray-800 mb-3">
                <span>Total</span>
                <span className="text-green-600 text-base">₹{grandTotal.toLocaleString()}</span>
              </div>
              {error && <Alert type="error" message={error} />}
              <Button className="w-full justify-center mt-2" onClick={handleGenerateInvoice}
                disabled={submitting || cart.length === 0}>
                {submitting ? <Spinner /> : <MdReceipt className="text-sm" />}
                {submitting ? 'Processing...' : 'Generate Invoice'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!successInvoice} onClose={() => setSuccessInvoice(null)} title="Invoice Created">
        {successInvoice && <InvoiceSuccess invoice={successInvoice} onClose={() => setSuccessInvoice(null)} />}
      </Modal>
    </div>
  )
}
