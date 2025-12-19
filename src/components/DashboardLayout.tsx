import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Scissors,
  FolderOpen,
  TrendingUp,
  FileText,
  UserCog,
  Store,
  Music2,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type NavKey =
  | 'Dashboard'
  | 'Inventory'
  | 'OrderSales'
  | 'Finance'
  | 'Expenses'
  | 'KosiedonCuts'
  | 'Files&Data'
  | 'CashFlow'
  | 'Taxation'
  | 'Account Settings'

const NAV_ITEMS: NavKey[] = [
  'Dashboard',
  'Inventory',
  'OrderSales',
  'Finance',
  'KosiedonCuts',
  'Account Settings',
]

export default function DashboardLayout() {
  const [active, setActive] = useState<NavKey>('Dashboard')
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  )
  const [orderSalesOpen, setOrderSalesOpen] = useState(true)
  const [financeOpen, setFinanceOpen] = useState(true)
  const [orderSalesSub, setOrderSalesSub] = useState<'Shopee' | 'Tiktok'>('Shopee')
  function handleLogout() {
    try {
      localStorage.clear()
    } catch { void 0 }
    window.location.reload()
  }

  function applyTheme(dark: boolean) {
    const el = document.documentElement
    if (dark) el.classList.add('dark')
    else el.classList.remove('dark')
    setIsDark(dark)
  }

  const ICONS: Record<NavKey, ReactNode> = {
    Dashboard: <LayoutDashboard className="h-4 w-4" />,
    Inventory: <Package className="h-4 w-4" />,
    OrderSales: <ShoppingCart className="h-4 w-4" />,
    Finance: <Wallet className="h-4 w-4" />,
    Expenses: <Wallet className="h-4 w-4" />,
    KosiedonCuts: <Scissors className="h-4 w-4" />,
    'Files&Data': <FolderOpen className="h-4 w-4" />,
    CashFlow: <TrendingUp className="h-4 w-4" />,
    Taxation: <FileText className="h-4 w-4" />,
    'Account Settings': <UserCog className="h-4 w-4" />,
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-background text-foreground grid ${
        collapsed ? 'md:grid-cols-[1fr]' : 'md:grid-cols-[240px_1fr]'
      }`}
    >
      {!collapsed && (
        <aside className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full">
          <div className="border-b border-sidebar-border px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">TPIMS</div>
              <div className="text-xs text-muted-foreground">Control Panel</div>
            </div>
          </div>
          <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const isActive = active === item
              if (item === 'Finance') {
                const financeActive = active === 'Expenses' || active === 'CashFlow' || active === 'Taxation'
                return (
                  <div key="Finance-root" className="space-y-1">
                    <button
                      onClick={() => {
                        setFinanceOpen(o => !o)
                      }}
                      title="Finance"
                      className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center justify-between ${
                        financeActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                          : 'bg-transparent border-transparent hover:bg-muted'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4">{ICONS['Finance']}</span>
                        <span className="font-medium">Finance</span>
                      </span>
                      <span className="text-xs">
                        {financeOpen ? '▾' : '▸'}
                      </span>
                    </button>
                    {financeOpen && (
                      <div className="pl-8 space-y-1">
                        <button
                          onClick={() => setActive('Expenses')}
                          title="Expenses"
                          className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center gap-2 ${
                            active === 'Expenses'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                              : 'bg-transparent border-transparent hover:bg-muted'
                          }`}
                        >
                          <Wallet className="h-4 w-4" />
                          <span className="text-sm">Expenses</span>
                        </button>
                        <button
                          onClick={() => setActive('CashFlow')}
                          title="CashFlow"
                          className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center gap-2 ${
                            active === 'CashFlow'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                              : 'bg-transparent border-transparent hover:bg-muted'
                          }`}
                        >
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">CashFlow</span>
                        </button>
                        <button
                          onClick={() => setActive('Taxation')}
                          title="Taxation"
                          className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center gap-2 ${
                            active === 'Taxation'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                              : 'bg-transparent border-transparent hover:bg-muted'
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Taxation</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              }
              if (item === 'OrderSales') {
                const rootActive = active === 'OrderSales'
                return (
                  <div key="OrderSales-root" className="space-y-1">
                    <button
                      onClick={() => {
                        setActive('OrderSales')
                        setOrderSalesOpen(o => !o)
                      }}
                      title="OrderSales"
                      className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center justify-between ${
                        rootActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                          : 'bg-transparent border-transparent hover:bg-muted'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4">{ICONS['OrderSales']}</span>
                        <span className="font-medium">OrderSales</span>
                      </span>
                      <span className="text-xs">
                        {orderSalesOpen ? '▾' : '▸'}
                      </span>
                    </button>
                    {orderSalesOpen && (
                      <div className="pl-8 space-y-1">
                        <button
                          onClick={() => {
                            setActive('OrderSales')
                            setOrderSalesSub('Shopee')
                          }}
                          title="Shopee"
                          className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center gap-2 ${
                            rootActive && orderSalesSub === 'Shopee'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                              : 'bg-transparent border-transparent hover:bg-muted'
                          }`}
                        >
                          <Store className="h-4 w-4" />
                          <span className="text-sm">Shopee</span>
                        </button>
                        <button
                          onClick={() => {
                            setActive('OrderSales')
                            setOrderSalesSub('Tiktok')
                          }}
                          title="Tiktok"
                          className={`w-full rounded-md border transition-colors px-3 py-2 flex items-center gap-2 ${
                            rootActive && orderSalesSub === 'Tiktok'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                              : 'bg-transparent border-transparent hover:bg-muted'
                          }`}
                        >
                          <Music2 className="h-4 w-4" />
                          <span className="text-sm">Tiktok</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  title={item}
                  className={`w-full rounded-md border transition-colors text-left px-3 py-2 flex items-center gap-2 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground border-transparent'
                      : 'bg-transparent border-transparent hover:bg-muted'
                  }`}
                >
                  <span className="h-4 w-4">{ICONS[item]}</span>
                  <span className="font-medium">{item}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-auto p-2 border-t border-sidebar-border shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </aside>
      )}
      <main className="p-3 sm:p-6 h-full overflow-y-auto">
        <Section
          name={active}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          isDark={isDark}
          onToggleDark={() => applyTheme(!isDark)}
          orderSalesSub={orderSalesSub}
        />
      </main>
    </div>
  )
}

function AddCuttedModal({
  products,
  onClose,
  onSaved,
}: {
  products: Array<{ category: string; type: string; product: string; qty: number }>
  onClose: () => void
  onSaved: (entry: {
    id: string
    date: string
    product: string
    status: 'Cutted'
    qty: number
  }) => void
}) {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [product, setProduct] = useState('')
  const [qty, setQty] = useState(1)
  const [saving, setSaving] = useState(false)

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const types = Array.from(new Set(products.filter(p => (category ? p.category === category : true)).map(p => p.type).filter(Boolean)))
  const productOptions = products
    .filter(p => (category ? p.category === category : true) && (type ? p.type === type : true))
    .map(p => p.product)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString().split('T')[0],
        product: product,
        status: 'Cutted' as const,
        qty,
      }
      onSaved(entry)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card text-card-foreground shadow-lg">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="font-medium">Add Cutted Item</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-muted px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value)
                setType('')
                setProduct('')
              }}
              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={e => {
                setType(e.target.value)
                setProduct('')
              }}
              disabled={!category}
              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              <option value="">Select Type</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Product</label>
            <select
              value={product}
              onChange={e => setProduct(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            >
              <option value="">Select Product</option>
              {productOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              required
              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={saving || !product}
              className="rounded-md bg-destructive text-destructive-foreground px-4 py-2 text-sm disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Add Cut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddSaleModal({
  platform,
  onClose,
  onSaved,
  productItems,
}: {
  platform: 'Shopee' | 'Tiktok'
  onClose: () => void
  onSaved: (rows: Array<Record<string, string | number | boolean | null>>) => void
  productItems: Array<{ category: string; type: string; product: string }>
}) {
  const [orderId, setOrderId] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('Completed')
  const [buyer, setBuyer] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'order' | 'buyer' | 'payment'>('order')
  const [payTab, setPayTab] = useState<'items' | 'fees'>('items')
  const [paymentEdits, setPaymentEdits] = useState<Record<string, string>>({})
  type Line = { category: string; type: string; product: string; variation: string; qty: number; price: number }
  const [lines, setLines] = useState<Line[]>([{ category: '', type: '', product: '', variation: '', qty: 1, price: 0 }])
  const categories = Array.from(new Set(productItems.map(p => p.category).filter(Boolean)))
  const [activeIdx, setActiveIdx] = useState(0)
  function typesFor(cat: string): string[] {
    return Array.from(new Set(productItems.filter(p => p.category === cat).map(p => p.type).filter(Boolean)))
  }
  function productsFor(cat: string, typ: string): string[] {
    return productItems.filter(p => (cat ? p.category === cat : true) && (typ ? p.type === typ : true)).map(p => p.product)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const base: Record<string, string | number | boolean | null> = {
        'Order Number': orderId,
        'DATE': date,
        'Status': status,
        'Buyer Username': buyer,
        'Buyer Address': buyerAddress,
      }
      const payments: Record<string, string | number | boolean | null> = {}
      const fieldsShopee: Array<{ label: string }> = [
        { label: 'Shipping fee paid by buyer' },
        { label: 'Estimated Shipping Fee Charged by Logistic Provider' },
        { label: 'Shipping fee Rebate' },
        { label: 'Service Fee' },
        { label: 'Transaction Fee' },
        { label: 'Tax' },
        { label: 'Merchandise Subtotal' },
        { label: 'Shipping Fee' },
        { label: 'Shopee Voucher' },
        { label: 'Seller Voucher' },
        { label: 'Payment discount' },
        { label: 'Shopee coin redeem' },
        { label: 'Total Buyer Payment' },
      ]
      const fieldsCommon: Array<{ label: string }> = [{ label: 'Total Buyer Payment' }]
      const useFields = platform === 'Shopee' ? fieldsShopee : fieldsCommon
      for (const f of useFields) {
        const v = paymentEdits[f.label]
        if (v !== undefined) payments[f.label] = v
      }
      const rows = lines.map(l => ({
        ...base,
        'Product Name': l.product,
        'Variation Name': l.variation,
        'Quantity': l.qty,
        'Item Price': l.price,
        ...payments,
      }))
      onSaved(rows)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add sale')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onKeyDown={e => {
        if (tab === 'payment' && payTab === 'items') {
          if (e.key === 'ArrowLeft') {
            setActiveIdx(i => Math.max(0, i - 1))
          } else if (e.key === 'ArrowRight') {
            setActiveIdx(i => Math.min(lines.length - 1, i + 1))
          }
        }
      }}
      tabIndex={-1}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-lg border border-border bg-card text-card-foreground shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="font-medium">Add Sale ({platform})</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-muted px-2 py-1 text-sm"
            >
              Close
            </button>
          </div>
          <form onSubmit={onSubmit} className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('order')}
                className={`rounded-md px-3 py-2 text-sm border ${tab === 'order' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
              >
                Order Information
              </button>
              <button
                type="button"
                onClick={() => setTab('buyer')}
                className={`rounded-md px-3 py-2 text-sm border ${tab === 'buyer' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
              >
                Buyer Information
              </button>
              <button
                type="button"
                onClick={() => setTab('payment')}
                className={`rounded-md px-3 py-2 text-sm border ${tab === 'payment' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
              >
                Payment Information
              </button>
            </div>
            <div className="rounded-md border border-border p-3 space-y-3">
              {tab === 'order' && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Order Number</label>
                    <input
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                      required
                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      placeholder="YYYY-MM-DD or Excel-like"
                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                      title="Order status"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              )}
              {tab === 'buyer' && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Buyer Username</label>
                    <input
                      value={buyer}
                      onChange={e => setBuyer(e.target.value)}
                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium">Buyer Address</label>
                    <input
                      value={buyerAddress}
                      onChange={e => setBuyerAddress(e.target.value)}
                      placeholder="Street, Barangay, City/Province, ZIP"
                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
              {tab === 'payment' && (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPayTab('items')}
                      className={`rounded-md px-3 py-2 text-sm border ${payTab === 'items' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                      title="Products"
                    >
                      Products
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayTab('fees')}
                      className={`rounded-md px-3 py-2 text-sm border ${payTab === 'fees' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                      title="Fees"
                    >
                      Fees
                    </button>
                  </div>
                  {payTab === 'items' ? (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Products</div>
                      <div className="rounded-md border border-border bg-background p-2 space-y-3">
                        <div className="flex items-center justify-center gap-1">
                          {lines.map((_, i) => (
                            <button
                              key={`dot-${i}`}
                              type="button"
                              onClick={() => setActiveIdx(i)}
                              className={`h-2.5 w-2.5 rounded-full ${activeIdx === i ? 'bg-primary' : 'bg-muted border border-border'}`}
                              title={`Go to item ${i + 1}`}
                            />
                          ))}
                        </div>
                        <div className="overflow-x-auto snap-x snap-mandatory">
                          <div className="flex gap-3">
                            {lines.map((l, idx) => {
                              const typeOptions = l.category ? typesFor(l.category) : []
                              const productOptions = productsFor(l.category, l.type)
                              return (
                                <div
                                  key={`L-${idx}`}
                                  className={`min-w-[100%] snap-center rounded-md border border-border p-3 ${activeIdx === idx ? 'bg-muted' : 'bg-background'}`}
                                >
                                  <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Item</div>
                                    <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                                      <select
                                        value={l.category}
                                        onChange={e =>
                                          setLines(prev => {
                                            const next = [...prev]
                                            next[idx] = { ...next[idx], category: e.target.value, type: '', product: '' }
                                            return next
                                          })
                                        }
                                        className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                        title="Category"
                                      >
                                        <option value="">Category</option>
                                        {categories.map(c => (
                                          <option key={`cat-${c}`} value={c}>
                                            {c}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        value={l.type}
                                        onChange={e =>
                                          setLines(prev => {
                                            const next = [...prev]
                                            next[idx] = { ...next[idx], type: e.target.value, product: '' }
                                            return next
                                          })
                                        }
                                        disabled={!l.category}
                                        className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                        title="Type"
                                      >
                                        <option value="">Type</option>
                                        {typeOptions.map(t => (
                                          <option key={`type-${t}`} value={t}>
                                            {t}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        value={l.product}
                                        onChange={e =>
                                          setLines(prev => {
                                            const next = [...prev]
                                            next[idx] = { ...next[idx], product: e.target.value }
                                            return next
                                          })
                                        }
                                        required
                                        disabled={!l.type}
                                        className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                        title="Product"
                                      >
                                        <option value="" disabled>
                                          Product
                                        </option>
                                        {productOptions.map(name => (
                                          <option key={`prod-${name}`} value={name}>
                                            {name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Quantity</label>
                                    <input
                                      type="number"
                                      value={l.qty}
                                      onChange={e =>
                                        setLines(prev => {
                                          const next = [...prev]
                                          next[idx] = { ...next[idx], qty: Number(e.target.value) }
                                          return next
                                        })
                                      }
                                      min={1}
                                      required
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Item Price</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={l.price}
                                      onChange={e =>
                                        setLines(prev => {
                                          const next = [...prev]
                                          next[idx] = { ...next[idx], price: Number(e.target.value) }
                                          return next
                                        })
                                      }
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setLines(prev => [...prev, { category: '', type: '', product: '', variation: '', qty: 1, price: 0 }])
                            }
                            className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm"
                            title="Add another product"
                          >
                            Add Item
                          </button>
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newLines = [...lines]
                                newLines.pop()
                                setLines(newLines)
                                setActiveIdx(Math.max(0, newLines.length - 1))
                              }}
                              className="rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm"
                              title="Remove last item"
                            >
                              Remove Item
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(() => {
                        const fieldsShopee: Array<{ label: string }> = [
                          { label: 'Shipping fee paid by buyer' },
                          { label: 'Estimated Shipping Fee Charged by Logistic Provider' },
                          { label: 'Shipping fee Rebate' },
                          { label: 'Service Fee' },
                          { label: 'Transaction Fee' },
                          { label: 'Tax' },
                          { label: 'Merchandise Subtotal' },
                          { label: 'Shipping Fee' },
                          { label: 'Shopee Voucher' },
                          { label: 'Seller Voucher' },
                          { label: 'Payment discount' },
                          { label: 'Shopee coin redeem' },
                          { label: 'Total Buyer Payment' },
                        ]
                        const fieldsCommon: Array<{ label: string }> = [{ label: 'Total Buyer Payment' }]
                        const useFields = platform === 'Shopee' ? fieldsShopee : fieldsCommon
                        return useFields.map(f => {
                          const current = paymentEdits[f.label] ?? ''
                          return (
                            <div key={`PM-${f.label}`} className="space-y-1">
                              <div className="text-xs text-muted-foreground">{f.label}</div>
                              <input
                                value={current}
                                onChange={e =>
                                  setPaymentEdits(prev => ({ ...prev, [f.label]: e.target.value }))
                                }
                                className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                          )
                        })
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
            {error && <div className="text-xs text-destructive">{error}</div>}
            <div className="flex items-center justify-end gap-2">
              <button
                type="submit"
                className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-muted text-foreground border border-border px-3 py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// removed header; control lives inside main content

function Section({
  name,
  collapsed,
  onToggle,
  isDark,
  onToggleDark,
  orderSalesSub,
}: {
  name: NavKey
  collapsed: boolean
  onToggle: () => void
  isDark: boolean
  onToggleDark: () => void
  orderSalesSub: 'Shopee' | 'Tiktok'
}) {
  type Row = Record<string, string | number | boolean | null>
  // rows removed with Files&Data page
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ordersShopee, setOrdersShopee] = useState<Row[]>(() => {
    try {
      const s = localStorage.getItem('ordersShopee') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  const [ordersTiktok, setOrdersTiktok] = useState<Row[]>(() => {
    try {
      const s = localStorage.getItem('ordersTiktok') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  const [importingShopee, setImportingShopee] = useState(false)
  const [importingTiktok, setImportingTiktok] = useState(false)
  const [, setErrorShopee] = useState<string | null>(null)
  const [, setErrorTiktok] = useState<string | null>(null)
  type ProductItem = {
    id: string
    category: string
    type: string
    product: string
    qty: number
    image_url: string | null
  }
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const s = localStorage.getItem('products') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ProductItem | null>(null)
  const [searchText, setSearchText] = useState('')
  const [searchScope, setSearchScope] = useState<'product' | 'category' | 'type'>('product')
  const [carousel, setCarousel] = useState<Record<string, number>>({})
  const [ordersShopeeHeaders, setOrdersShopeeHeaders] = useState<Array<{ col: string; header: string; index: number }>>([])
  const [ordersTiktokHeaders, setOrdersTiktokHeaders] = useState<Array<{ col: string; header: string; index: number }>>([])
  const [ordersEdits, setOrdersEdits] = useState<Record<string, Record<string, string>>>({})
  const [buyerUsernames, setBuyerUsernames] = useState<Record<string, string>>({})
  const [editingOrder, setEditingOrder] = useState<{ orderId: string; date: string; status: string; total: number; items: OrderItem[] } | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [editTab, setEditTab] = useState<'order' | 'buyer' | 'payment'>('order')
  const [productAccOpen, setProductAccOpen] = useState<number>(0)
  const [orderSearchText, setOrderSearchText] = useState('')
  const [orderSearchScope, setOrderSearchScope] = useState<'order' | 'buyer' | 'product' | 'all'>('order')
  const [showAddSale, setShowAddSale] = useState(false)
  const [cashFlowRows, setCashFlowRows] = useState<Row[]>(() => {
    try {
      const s = localStorage.getItem('cashFlowRows') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  
  useEffect(() => {
    try { localStorage.setItem('ordersShopee', JSON.stringify(ordersShopee)) } catch { /* noop */ }
  }, [ordersShopee])
  useEffect(() => {
    try { localStorage.setItem('ordersTiktok', JSON.stringify(ordersTiktok)) } catch { /* noop */ }
  }, [ordersTiktok])
  useEffect(() => {
    try { localStorage.setItem('cashFlowRows', JSON.stringify(cashFlowRows)) } catch { /* noop */ }
  }, [cashFlowRows])
  useEffect(() => {
    try { localStorage.setItem('products', JSON.stringify(products)) } catch { /* noop */ }
  }, [products])
  
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!isSupabaseConfigured) return
      if (products.length > 0) return
      try {
        let rows: any[] = []
        const q1 = await supabase!.from('inventory').select('product, qty, image_url, category, type')
        if (q1.error) {
          const q2 = await supabase!.from('inventory').select('product, qty, image_url')
          if (!q2.error) rows = q2.data ?? []
        } else {
          rows = q1.data ?? []
        }
        if (active && Array.isArray(rows) && rows.length) {
          const mapped = rows.map((r: any) => ({
            id: String(r.product ?? ''),
            category: String(r.category ?? ''),
            type: String(r.type ?? ''),
            product: String(r.product ?? ''),
            qty: Number(r.qty ?? 0),
            image_url: r.image_url ?? null,
          }))
          if (mapped.some(m => m.product)) setProducts(mapped)
        }
      } catch { /* noop */ }
    })()
    return () => { active = false }
  }, [isSupabaseConfigured])
  const [importingCashFlow, setImportingCashFlow] = useState(false)
  const [errorCashFlow, setErrorCashFlow] = useState<string | null>(null)
  const [kosiedonTab, setKosiedonTab] = useState<'Cutted' | 'Returned'>('Returned')
  const [taxationEntries, setTaxationEntries] = useState<
    Array<{ id: string; date: string; orderId: string; type: string; amount: number; platform: 'Shopee' | 'Tiktok' }>
  >(() => {
    try {
      const s = localStorage.getItem('taxationEntries') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  const [kosiedonCutsEntries, setKosiedonCutsEntries] = useState<
    Array<{ id: string; date: string; orderId?: string; product: string; platform?: 'Shopee' | 'Tiktok' | 'Manual'; status: string; qty?: number }>
  >(() => {
    try {
      const s = localStorage.getItem('kosiedonCutsEntries') ?? '[]'
      const p = JSON.parse(s)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  })
  const [showAddCutted, setShowAddCutted] = useState(false)
  const [statusAccordionOpen, setStatusAccordionOpen] = useState(false)
  const ordersData = orderSalesSub === 'Shopee' ? ordersShopee : ordersTiktok
  const ordersHeaders = orderSalesSub === 'Shopee' ? ordersShopeeHeaders : ordersTiktokHeaders
  function field(row: Row, keys: string[], fallback = ''): string {
    const normKey = (s: string) =>
      s.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim()
    const normalized = Object.fromEntries(Object.keys(row).map(k => [normKey(k), k]))
    for (const key of keys) {
      const target = normKey(key)
      const exact = normalized[target]
      if (exact) {
        const v = row[exact]
        if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
      }
      const fuzzy = Object.entries(normalized).find(([nk]) => nk.includes(target))
      if (fuzzy) {
        const v = row[fuzzy[1]]
        if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
      }
    }
    return fallback
  }
  function toNum(s: string, fallback = 0): number {
    const raw = String(s).trim()
    const parenNeg = /^\(.*\)$/.test(raw)
    const normalizedMinus = raw.replace(/[−–—]/g, '-')
    const cleaned = normalizedMinus.replace(/[^0-9.-]/g, '')
    let n = Number(cleaned)
    if (!Number.isFinite(n)) return fallback
    if (parenNeg && n > 0) n = -n
    return n
  }
  function excelSerialToISO(serial: number): string {
    const epoch = Date.UTC(1899, 11, 30)
    const ms = epoch + Math.round(serial) * 86400000
    const d = new Date(ms)
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  function formatDate(val: string): string {
    const s = String(val).trim()
    if (s === '') return ''
    const n = Number(s)
    if (Number.isFinite(n)) return excelSerialToISO(n)
    const iso = s.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
    if (iso) {
      const y = Number(iso[1])
      const m = Number(iso[2])
      const d = Number(iso[3])
      const mm = String(m).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      return `${y}-${mm}-${dd}`
    }
    const dmy = s.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/)
    if (dmy) {
      const d = Number(dmy[1])
      const m = Number(dmy[2])
      const y = Number(dmy[3])
      const mm = String(m).padStart(2, '0')
      const dd = String(d).padStart(2, '0')
      return `${y}-${mm}-${dd}`
    }
    const months: Record<string, number> = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    }
    const dMonY = s.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/)
    if (dMonY) {
      const d = Number(dMonY[1])
      const m = months[dMonY[2].slice(0, 3).toLowerCase()] ?? 0
      const y = Number(dMonY[3])
      if (m > 0) {
        const mm = String(m).padStart(2, '0')
        const dd = String(d).padStart(2, '0')
        return `${y}-${mm}-${dd}`
      }
    }
    const monDY = s.match(/([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})/)
    if (monDY) {
      const m = months[monDY[1].slice(0, 3).toLowerCase()] ?? 0
      const d = Number(monDY[2])
      const y = Number(monDY[3])
      if (m > 0) {
        const mm = String(m).padStart(2, '0')
        const dd = String(d).padStart(2, '0')
        return `${y}-${mm}-${dd}`
      }
    }
    const clean = s.split(' ')[0]
    return clean
  }
  function formatDateDisplay(val: string): string {
    const iso = formatDate(val)
    if (!iso) return '—'
    const parts = iso.split(/[-/]/)
    if (parts.length === 3) {
      const [y, m, d] = parts
      return `${d}/${m}/${y}`
    }
    return iso
  }
  async function handleImportCashFlow(files: FileList) {
    setImportingCashFlow(true)
    setErrorCashFlow(null)
    try {
      const allRows: Row[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const firstSheet = wb.SheetNames[0]
        const ws = wb.Sheets[firstSheet]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '', range: 17 })
        allRows.push(...(json as Row[]))
      }
      setCashFlowRows(prev => {
        const combined = [...prev, ...allRows]
        // Auto-complete orders
        const completedIds = new Set<string>()
        for (const r of allRows) {
          const oid = field(r, ['Order ID', 'Order Number', 'Order No'], '')
          if (oid) completedIds.add(oid)
        }
        if (completedIds.size > 0) {
          setOrdersShopee(curr => curr.map(o => {
            const oid = field(o, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '')
            if (completedIds.has(oid)) {
              // Update status to Completed if not already
              return { ...o, Status: 'Completed', 'Order Status': 'Completed' }
            }
            return o
          }))
          setOrdersTiktok(curr => curr.map(o => {
            const oid = field(o, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '')
            if (completedIds.has(oid)) {
               return { ...o, Status: 'Completed', 'Order Status': 'Completed' }
            }
            return o
          }))
        }

        return combined.sort((a, b) => {
          const dateA = formatDate(field(a, ['DATE', 'Date'], ''))
          const dateB = formatDate(field(b, ['DATE', 'Date'], ''))
          if (!dateA && !dateB) return 0
          if (!dateA) return 1
          if (!dateB) return -1
          return dateB.localeCompare(dateA)
        })
      })
    } catch (e: unknown) {
      setErrorCashFlow(e instanceof Error ? e.message : 'Failed to import CashFlow data')
    } finally {
      setImportingCashFlow(false)
    }
  }
  function collectTotals(row: Row): number[] {
    const normKey = (s: string) =>
      s.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim()
    const totals: number[] = []
    for (const k of Object.keys(row)) {
      const nk = normKey(k)
      if (nk === 'total') {
        const v = row[k]
        if (v !== undefined && v !== null) {
          const num = toNum(String(v), NaN)
          if (Number.isFinite(num)) totals.push(num)
        }
      }
    }
    return totals
  }
  function cleanName(raw: string): string {
    const s = raw.trim()
    const a = s.replace(/\s*-\s*.+$/, '')
    const b = a.replace(/\s*\(.+\)\s*$/, '')
    const c = b.replace(/\s*\/\s*.+$/, '')
    const d = c.replace(/\s*,\s*.+$/, '')
    return d.trim()
  }
  function displayName(raw: string): string {
    let s = String(raw)
    s = s.replace(/#/g, '')
    s = s.replace(/(?<![A-Za-z-])\d+(?![A-Za-z-])/g, '')
    s = s.replace(/\s{2,}/g, ' ').trim()
    return s
  }
  function canonicalizeName(raw: string): string {
    const s = displayName(raw).toLowerCase()
    return s.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s{2,}/g, ' ').trim()
  }
  function toTokens(s: string): string[] {
    const syn: Record<string, string> = {
      fuschia: 'fuchsia',
      'off-white': 'off white',
      offwhite: 'off white',
    }
    return s
      .split(' ')
      .map(t => syn[t] ?? t)
      .filter(Boolean)
  }
  function jaccard(a: string[], b: string[]): number {
    const sa = new Set(a)
    const sb = new Set(b)
    const inter = Array.from(sa).filter(x => sb.has(x)).length
    const union = new Set([...a, ...b]).size
    return union === 0 ? 0 : inter / union
  }
  function resolveInventory(baseRaw: string, varRaw: string): { product: string; image_url: string | null } {
    const inv = products.map(p => ({
      product: p.product,
      image_url: p.image_url,
      canon: canonicalizeName(p.product),
      tokens: toTokens(canonicalizeName(p.product)),
    }))
    const cBase = canonicalizeName(baseRaw)
    const cVar = canonicalizeName(varRaw)
    const candidates = [(`${cBase} ${cVar}`).trim(), cBase, cVar].filter(Boolean)
    for (const cand of candidates) {
      const exact = inv.find(x => x.canon === cand)
      if (exact) return { product: exact.product, image_url: exact.image_url }
    }
    let best: { score: number; hit: { product: string; image_url: string | null } | null } = { score: 0, hit: null }
    for (const cand of candidates) {
      const t = toTokens(cand)
      for (const x of inv) {
        const s = jaccard(t, x.tokens)
        if (s > best.score) best = { score: s, hit: { product: x.product, image_url: x.image_url } }
      }
    }
    if (best.hit && best.score >= 0.4) return best.hit
    const fallback = inv.find(x => {
      if (!cBase) return false
      if (x.canon.includes(cBase)) return true
      const inter = new Set(toTokens(cBase).filter(tok => x.tokens.includes(tok)))
      return inter.size >= 2
    })
    if (fallback) return { product: fallback.product, image_url: fallback.image_url }
    return { product: baseRaw || varRaw, image_url: null }
  }
  function resolveHeaderKey(row: Row, label: string): string | null {
    const normKey = (s: string) =>
      s.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim()
    const normalized = Object.fromEntries(Object.keys(row).map(k => [normKey(k), k]))
    const target = normKey(label)
    const exact = normalized[target]
    if (exact) return exact
    const fuzzy = Object.entries(normalized).find(([nk]) => nk.includes(target))
    return fuzzy ? fuzzy[1] : null
  }
  function getCell(row: Row, labels: string[]): { key: string | null; value: string } {
    for (const l of labels) {
      const k = resolveHeaderKey(row, l)
      if (k) {
        const v = String((row as unknown as Record<string, unknown>)[k] ?? '')
        return { key: k, value: v }
      }
    }
    return { key: null, value: '' }
  }
  function isDateHeader(h: string): boolean {
    const s = h.toLowerCase()
    return (
      s.includes('date') ||
      s.includes('payout') ||
      s.includes('delivered')
    )
  }
  function isOrderNumberHeader(h: string): boolean {
    const s = h.toLowerCase()
    return (
      s.includes('order id') ||
      s.includes('order number') ||
      s.includes('order no') ||
      s === 'orderid' ||
      s.includes('orderid')
    )
  }
  function isStatusHeader(h: string): boolean {
    return h.toLowerCase().includes('status')
  }
  function matchInventoryName(name: string, base: string): { product: string; image_url: string | null } {
    return resolveInventory(name, base)
  }
  async function syncInventoryFromRows(rowsIn: Row[], platform: 'Shopee' | 'Tiktok') {
    try {
      const synced = new Set<string>((() => {
        try {
          return JSON.parse(localStorage.getItem('syncedOrderItems') ?? '[]')
        } catch {
          return []
        }
      })())
      const sold: Record<string, number> = {}
      const restored: Record<string, number> = {}
      const returnsLog: Array<{
        orderId: string
        product: string
        variation: string
        qty: number
        date: string
        status: string
      }> = []
      for (const row of rowsIn) {
        const rawOrderId = field(row, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '')
        const orderId = String(rawOrderId).trim()
        const status = field(row, ['Status'], '')
        const variation = field(row, ['Variation Name', 'Variation', 'Variant', 'SKU Options'], '')
        const baseProduct = field(row, ['Product Name', 'Product', 'Products'], '')
        const baseClean = cleanName(baseProduct)
        const varClean = cleanName(variation)
        const lookup = baseClean || varClean
        const resolved = matchInventoryName(lookup, baseClean)
        const qty = toNum(field(row, ['Quantity', 'Qty', 'quanity'], '0'), 0)
        if (!orderId || !resolved.product || qty <= 0) continue
        const s = String(status).toLowerCase()
        if (/return/.test(s)) {
          const keyInc = `${platform}|${orderId}|${resolved.product}|${varClean}|inc`
          if (synced.has(keyInc)) continue
          restored[resolved.product] = (restored[resolved.product] ?? 0) + qty
          synced.add(keyInc)
          returnsLog.push({
            orderId,
            product: resolved.product,
            variation: varClean,
            qty,
            date: formatDate(field(row, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE'], '')),
            status,
          })
        } else {
          const key = `${platform}|${orderId}|${resolved.product}|${varClean}|dec`
          if (synced.has(key)) continue
          sold[resolved.product] = (sold[resolved.product] ?? 0) + qty
          synced.add(key)
        }
      }
      if (Object.keys(sold).length === 0 && Object.keys(restored).length === 0) return
      // update local products state
      setProducts(prev => {
        const next = prev.map(p => {
          const dec = sold[p.product] ?? 0
          const inc = restored[p.product] ?? 0
          const newQty = Math.max(0, (p.qty ?? 0) - dec + inc)
          return inc > 0 || dec > 0 ? { ...p, qty: newQty } : p
        })
        return next
      })
      // update Supabase if configured
      if (isSupabaseConfigured) {
        const all = Array.from(new Set<string>([...Object.keys(sold), ...Object.keys(restored)]))
        for (const name of all) {
          try {
            const { data } = await supabase!.from('inventory').select('id, qty').eq('product', name).limit(1)
            const current = Number(data?.[0]?.qty ?? 0)
            const dec = sold[name] ?? 0
            const inc = restored[name] ?? 0
            const newQty = Math.max(0, current - dec + inc)
            await supabase!.from('inventory').update({ qty: newQty }).eq('product', name)
          } catch { void 0 }
        }
        for (const ret of returnsLog) {
          try {
            await supabase!.from('kosiedoncuts').insert({
              order_id: ret.orderId,
              product: ret.product,
              variation: ret.variation,
              qty: ret.qty,
              platform,
              date: ret.date,
              status: ret.status,
            })
          } catch { void 0 }
        }
      }
      try {
        localStorage.setItem('syncedOrderItems', JSON.stringify(Array.from(synced)))
      } catch {
        /* ignore */
      }
    } catch {
      /* ignore */
    }
  }
  type OrderItem = {
    orderId: string
    product: string
    variation: string
    qty: number
    image_url: string | null
    date: string
    status: string
    itemPrice: number
    rowTotal: number
    buyerTotal: number
    sourceRow: Row
  }
  let lastOrderId = ''
  const orderItems: OrderItem[] = []
  for (const row of ordersData) {
    const rawOrderId = field(row, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '')
    const normalizedOrderId = String(rawOrderId).trim()
    const orderId = normalizedOrderId || lastOrderId || 'Unknown'
    if (normalizedOrderId) lastOrderId = normalizedOrderId
    const variation = field(row, ['Variation Name', 'Variation', 'Variant', 'SKU Options'], '')
    const baseProduct = field(row, ['Product Name', 'Product', 'Products'], '')
    const baseClean = cleanName(baseProduct)
    const varClean = cleanName(variation)
    const resolved = resolveInventory(baseClean, varClean)
    const qty = toNum(field(row, ['Quantity', 'Qty', 'quanity'], '0'), 0)
    const rawDate = field(row, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE'], '')
    const date = formatDate(rawDate)
    const status = field(row, ['Status'], '')
    const itemPrice = toNum(field(row, ['Item Price', 'Price'], '0'), 0)
    const totals = collectTotals(row)
    const rowTotal = totals[1] ?? totals[0] ?? itemPrice * qty
    const buyerTotal = toNum(field(row, ['Total Buyer Payment'], '0'), 0)
    orderItems.push({
      orderId,
      product: baseProduct,
      variation,
      qty,
      image_url: resolved.image_url,
      date,
      status,
      itemPrice,
      rowTotal,
      buyerTotal,
      sourceRow: row,
    })
  }
  const knownOrderItems = orderItems.filter(it => it.orderId && it.orderId !== 'Unknown')
  const unknownCount = orderItems.length - knownOrderItems.length
  const groupedByOrder = knownOrderItems.reduce((acc, item) => {
    const key = item.orderId
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, OrderItem[]>)
  const orders = Object.entries(groupedByOrder).map(([orderId, items]) => {
    const date = items.find(i => i.date)?.date || ''
    const status = items.find(i => i.status)?.status || ''
    const buyerTotals = items.map(i => i.buyerTotal).filter(v => v > 0)
    const sumRowTotals = items.reduce((sum, i) => sum + (i.rowTotal > 0 ? i.rowTotal : i.itemPrice * i.qty), 0)
    const total = sumRowTotals || (buyerTotals.length ? Math.max(...buyerTotals) : 0)
    const buyer = (() => {
      for (const it of items) {
        const v = field(it.sourceRow, ['Buyer Username', 'buyer username', 'Buyer Name', 'Buyer'], '')
        if (v && String(v).trim() !== '') return String(v).trim()
      }
      return ''
    })()
    return { orderId, date, status, total, items, buyer }
  })

  const soldTotals: Record<string, number> = (() => {
    const rowsAll: Row[] = [...ordersShopee, ...ordersTiktok]
    const out: Record<string, number> = {}
    for (const row of rowsAll) {
      const status = field(row, ['Status'], '')
      const s = status.toLowerCase()
      if (/cancel|return/.test(s)) continue
      const baseProduct = field(row, ['Product Name', 'Product', 'Products'], '')
      const variation = field(row, ['Variation Name', 'Variation', 'Variant', 'SKU Options'], '')
      const resolved = resolveInventory(cleanName(baseProduct), cleanName(variation))
      const qty = toNum(field(row, ['Quantity', 'Qty', 'quanity'], '0'), 0)
      if (!resolved.product) continue
      out[resolved.product] = (out[resolved.product] ?? 0) + qty
    }
    return out
  })()
  const expenseTotal = products.reduce((sum, p) => {
    const t = (p.type ?? '').toLowerCase()
    const unit = t.includes('printed') ? 25 : t.includes('plain') ? 16.3 : 0
    return sum + (p.qty ?? 0) * unit
  }, 0)
  const [expenseTabMain, setExpenseTabMain] = useState<
    'Products' | 'Government Expenses' | 'Petrol' | 'Food' | 'Materials' | 'Parking' | 'Ads'
  >('Products')
  const [catExpenses, setCatExpenses] = useState<
    Record<string, Array<{ id: string; name: string; amount: number; date: string }>>
  >(() => {
    try {
      const s = localStorage.getItem('catExpenses') ?? '{}'
      const p = JSON.parse(s)
      return p && typeof p === 'object' ? p : {}
    } catch {
      return {}
    }
  })
  const [newExpName, setNewExpName] = useState('')
  const [newExpAmount, setNewExpAmount] = useState('')
  const [newExpDate, setNewExpDate] = useState('')
  const [extraProducts, setExtraProducts] = useState<ProductItem[]>(() => {
    try {
      const raw = localStorage.getItem('expensesProductsExtra') ?? '[]'
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) {
        return arr
          .filter(x => x && typeof x === 'object')
          .map(x => ({
            id: String(x.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`),
            category: String(x.category ?? ''),
            type: String(x.type ?? ''),
            product: String(x.product ?? ''),
            qty: Number(x.qty ?? 0),
            image_url: null,
          }))
      }
      return []
    } catch {
      return []
    }
  })
  const [newProdName, setNewProdName] = useState('')
  const [newProdType, setNewProdType] = useState<'Plain' | 'Printed'>('Plain')
  const [newProdQty, setNewProdQty] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addMode, setAddMode] = useState<'Product' | 'Category'>('Product')
  const [searchAddText, setSearchAddText] = useState('')

  async function handleImport(files: FileList) {
    setImporting(true)
    setError(null)
    try {
      const allRows: Row[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const firstSheet = wb.SheetNames[0]
        const ws = wb.Sheets[firstSheet]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        allRows.push(...(json as Row[]))
      }
      const mapped = rowsToProducts(allRows)
      if (mapped.length) setProducts(mapped)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to import')
    } finally {
      setImporting(false)
    }
  }


  async function handleImportShopee(files: FileList) {
    setImportingShopee(true)
    setErrorShopee(null)
    try {
      const allRows: Row[] = []
      const headersArr: Array<{ col: string; header: string; index: number }> = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const firstSheet = wb.SheetNames[0]
        const ws = wb.Sheets[firstSheet]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        allRows.push(...(json as Row[]))

        if (i === 0) {
          const ref = ws['!ref']
          if (ref) {
            const range = XLSX.utils.decode_range(ref)
            const r0 = range.s.r
            for (let c = range.s.c; c <= range.e.c; c++) {
              const addr = XLSX.utils.encode_cell({ r: r0, c })
              const cellObj = (ws as unknown as Record<string, { v?: unknown }>)[addr]
              const header = cellObj && cellObj.v != null ? String(cellObj.v).trim() : ''
              const col = XLSX.utils.encode_col(c)
              if (header) headersArr.push({ col, header, index: c })
            }
          }
        }
      }

      setOrdersShopee(prev => [...prev, ...allRows])
      setOrdersShopeeHeaders(headersArr)

      try {
        const grouped: Record<string, { date: string; orderId: string; amount: number }> = {}
        const canceled: Array<{ id: string; date: string; orderId: string; product: string; platform: 'Shopee'; status: string; qty?: number }> = []
        for (const r of allRows) {
          const orderId = field(r, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '').trim()
          if (!orderId) continue

          const status = field(r, ['Status', 'Order Status', 'order status'], '')
          if (/return/i.test(status)) {
             const date = field(r, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE', 'Created Time'], '')
             const product = field(r, ['Product Name', 'Product', 'Products'], '')
             const qty = toNum(field(r, ['Quantity', 'Qty', 'quanity'], '1'), 1)
             canceled.push({
               id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
               date,
               orderId,
               product,
               platform: 'Shopee',
               status,
               qty
             })
             continue
          }

          const taxAmt = toNum(field(r, ['Tax'], '0'), 0)
          if (taxAmt === 0) continue
          const date = field(r, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE'], '')
          const g = grouped[orderId] ?? { date, orderId, amount: 0 }
          g.amount += taxAmt
          if (!g.date) g.date = date
          grouped[orderId] = g
        }
        if (canceled.length) {
          setKosiedonCutsEntries(prev => {
            const merged = [...prev]
            for (const c of canceled) {
               if (!merged.find(m => m.orderId === c.orderId)) {
                 merged.push(c)
               }
            }
            try { localStorage.setItem('kosiedonCutsEntries', JSON.stringify(merged)) } catch { void 0 }
            return merged
          })
        }
        const entries = Object.values(grouped).map(g => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          date: g.date,
          orderId: g.orderId,
          type: 'ShopTax' as const,
          amount: g.amount,
          platform: 'Shopee' as const,
        }))
        if (entries.length) {
          setTaxationEntries(prev => {
            const merged = [...prev]
            for (const entry of entries) {
              const idx = merged.findIndex(e => e.orderId === entry.orderId)
              if (idx !== -1) {
                merged[idx] = {
                  ...merged[idx],
                  amount: entry.amount,
                  date: entry.date || merged[idx].date,
                  platform: entry.platform || merged[idx].platform,
                }
              } else {
                merged.push(entry)
              }
            }
            try {
              localStorage.setItem('taxationEntries', JSON.stringify(merged))
            } catch {
              void 0
            }
            return merged
          })
        }
      } catch {
        void 0
      }
      await syncInventoryFromRows(allRows, 'Shopee')
    } catch (e: unknown) {
      setErrorShopee(e instanceof Error ? e.message : 'Failed to import Shopee data')
    } finally {
      setImportingShopee(false)
    }
  }

  async function handleImportTiktok(files: FileList) {
    setImportingTiktok(true)
    setErrorTiktok(null)
    try {
      const allRows: Row[] = []
      const headersArr: Array<{ col: string; header: string; index: number }> = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const firstSheet = wb.SheetNames[0]
        const ws = wb.Sheets[firstSheet]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        allRows.push(...(json as Row[]))

        if (i === 0) {
          const ref = ws['!ref']
          if (ref) {
            const range = XLSX.utils.decode_range(ref)
            const r0 = range.s.r
            for (let c = range.s.c; c <= range.e.c; c++) {
              const addr = XLSX.utils.encode_cell({ r: r0, c })
              const cellObj = (ws as unknown as Record<string, { v?: unknown }>)[addr]
              const header = cellObj && cellObj.v != null ? String(cellObj.v).trim() : ''
              const col = XLSX.utils.encode_col(c)
              if (header) headersArr.push({ col, header, index: c })
            }
          }
        }
      }

      setOrdersTiktok(prev => [...prev, ...allRows])
      setOrdersTiktokHeaders(headersArr)

      try {
        const grouped: Record<string, { date: string; orderId: string; amount: number }> = {}
        const canceled: Array<{ id: string; date: string; orderId: string; product: string; platform: 'Tiktok'; status: string; qty?: number }> = []
        for (const r of allRows) {
          const orderId = field(r, ['Order ID', 'Order Number', 'Order No', 'OrderID', 'Order number'], '').trim()
          if (!orderId) continue

          const status = field(r, ['Status', 'Order Status', 'order status'], '')
          if (/return/i.test(status)) {
             const date = field(r, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE', 'Created Time'], '')
             const product = field(r, ['Product Name', 'Product', 'Products'], '')
             const qty = toNum(field(r, ['Quantity', 'Qty', 'quanity'], '1'), 1)
             canceled.push({
               id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
               date,
               orderId,
               product,
               platform: 'Tiktok',
               status,
               qty
             })
             continue
          }

          const taxAmt = toNum(field(r, ['Tax'], '0'), 0)
          if (taxAmt === 0) continue
          const date = field(r, ['DATE', 'Date', 'delivered date / estimated payout date', 'PAYOUT COMPLETED DATE'], '')
          const g = grouped[orderId] ?? { date, orderId, amount: 0 }
          g.amount += taxAmt
          if (!g.date) g.date = date
          grouped[orderId] = g
        }
        if (canceled.length) {
          setKosiedonCutsEntries(prev => {
            const merged = [...prev]
            for (const c of canceled) {
               if (!merged.find(m => m.orderId === c.orderId)) {
                 merged.push(c)
               }
            }
            try { localStorage.setItem('kosiedonCutsEntries', JSON.stringify(merged)) } catch { void 0 }
            return merged
          })
        }
        const entries = Object.values(grouped).map(g => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          date: g.date,
          orderId: g.orderId,
          type: 'ShopTax' as const,
          amount: g.amount,
          platform: 'Tiktok' as const,
        }))
        if (entries.length) {
          setTaxationEntries(prev => {
            const merged = [...prev]
            for (const entry of entries) {
              const idx = merged.findIndex(e => e.orderId === entry.orderId)
              if (idx !== -1) {
                merged[idx] = {
                  ...merged[idx],
                  amount: entry.amount,
                  date: entry.date || merged[idx].date,
                  platform: entry.platform || merged[idx].platform,
                }
              } else {
                merged.push(entry)
              }
            }
            try {
              localStorage.setItem('taxationEntries', JSON.stringify(merged))
            } catch {
              void 0
            }
            return merged
          })
        }
      } catch {
        void 0
      }
      await syncInventoryFromRows(allRows, 'Tiktok')
    } catch (e: unknown) {
      setErrorTiktok(e instanceof Error ? e.message : 'Failed to import Tiktok data')
    } finally {
      setImportingTiktok(false)
    }
  }

  // removed per centralized Files&Data export

  function rowsToProducts(items: Row[]): ProductItem[] {
    function pick(obj: Row, keys: string[], fallback: string = ''): string {
      const lower = Object.fromEntries(Object.keys(obj).map(k => [k.toLowerCase(), k]))
      for (const key of keys) {
        const found = lower[key.toLowerCase()]
        if (found) {
          const v = obj[found]
          if (v !== undefined && v !== null && String(v).trim() !== '') return String(v)
        }
      }
      return fallback
    }
    function pickNum(obj: Row, keys: string[], fallback = 0): number {
      const s = pick(obj, keys, '')
      const n = Number(s)
      return Number.isFinite(n) ? n : fallback
    }
    return items.map((row, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
      category: pick(row, ['Category', 'category']),
      type: pick(row, ['Type', 'type']),
      product: pick(row, ['Product', 'Products', 'product', 'Name', 'name']),
      qty: pickNum(row, ['Qty', 'qty', 'Quantity', 'quanity']),
      image_url: pick(row, ['Image', 'image', 'Image URL', 'image_url'], '') || null,
    }))
  }

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground p-3 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground border border-border hover:bg-accent transition-colors"
            aria-label={collapsed ? 'Show sidebar' : 'Hide sidebar'}
            title={collapsed ? 'Show sidebar' : 'Hide sidebar'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <rect x="4.5" y="5.5" width="4" height="13" rx="1" fill="currentColor" />
              <rect x="10" y="8" width="9" height="2" rx="1" fill="currentColor" />
              <rect x="10" y="12" width="9" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
          <div className="space-y-1">
            <div className="text-lg font-medium">
              {name === 'OrderSales' ? `OrderSales • ${orderSalesSub}` : name}
            </div>
          </div>
        </div>
        <ThemeToggle isDark={isDark} onToggle={onToggleDark} />
      </div>
      <div className="mt-4 rounded-md border border-border bg-background p-4">
        {name === 'Dashboard' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(() => {
                const allOrders = [...ordersShopee, ...ordersTiktok]
                const totalSales = allOrders.reduce((sum, row) => {
                  const val = field(row, ['Total Buyer Payment', 'Total Amount'])
                  return sum + toNum(val, 0)
                }, 0)

                const totalExpenses = Object.values(catExpenses)
                  .flat()
                  .reduce((sum, item) => sum + item.amount, 0)
                const netProfit = totalSales - totalExpenses
                const inventoryCount = products.reduce((sum, p) => sum + p.qty, 0)

                return (
                  <>
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Sales
                      </div>
                      <div className="text-2xl font-bold">
                        ₱{totalSales.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Expenses
                      </div>
                      <div className="text-2xl font-bold">
                        ₱{totalExpenses.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <div className="text-sm font-medium text-muted-foreground">
                        Net Profit
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ₱{netProfit.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                      <div className="text-sm font-medium text-muted-foreground">
                        Inventory Items
                      </div>
                      <div className="text-2xl font-bold">
                        {inventoryCount.toLocaleString()}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                <div className="mb-4 text-lg font-semibold">Sales Trend</div>
                <div className="h-[300px] w-full">
                  {(() => {
                    const allOrders = [...ordersShopee, ...ordersTiktok]
                    const salesByDate: Record<string, number> = {}
                    allOrders.forEach(row => {
                      const dateRaw = field(row, [
                        'DATE',
                        'Date',
                        'Created Time',
                        'Time Created',
                      ])
                      const date = formatDate(dateRaw)
                      const val = field(row, [
                        'Total Buyer Payment',
                        'Total Amount',
                      ])
                      const amount = toNum(val, 0)
                      if (date && amount > 0) {
                        salesByDate[date] = (salesByDate[date] || 0) + amount
                      }
                    })
                    const data = Object.entries(salesByDate)
                      .map(([date, amount]) => ({ date, amount }))
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(-30)

                    if (data.length === 0)
                      return (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No sales data
                        </div>
                      )

                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" hide />
                          <YAxis />
                          <Tooltip
                            formatter={value => `₱${Number(value).toLocaleString()}`}
                            labelFormatter={label => `Date: ${label}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#8884d8"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )
                  })()}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                <div className="mb-4 text-lg font-semibold">
                  Expense Breakdown
                </div>
                <div className="h-[300px] w-full">
                  {(() => {
                    const data = Object.entries(catExpenses)
                      .map(([name, items]) => ({
                        name,
                        value: items.reduce((sum, item) => sum + item.amount, 0),
                      }))
                      .filter(item => item.value > 0)

                    const COLORS = [
                      '#0088FE',
                      '#00C49F',
                      '#FFBB28',
                      '#FF8042',
                      '#8884d8',
                      '#82ca9d',
                    ]

                    if (data.length === 0)
                      return (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No expense data
                        </div>
                      )

                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {data.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={value => `₱${Number(value).toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
        {name === 'Inventory' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">{error ? error : products.length ? `${products.length} items` : 'No items'}</div>
              <div className="ml-auto" />
              <label className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.csv"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) handleImport(e.target.files)
                    e.currentTarget.value = ''
                  }}
                  className="sr-only"
                />
                {importing ? 'Importing…' : 'Import Inventory'}
              </label>
              <div className="w-[320px] inline-flex items-stretch rounded-md border border-border bg-background text-foreground">
                <select
                  value={searchScope}
                  onChange={e => setSearchScope(e.target.value as 'product' | 'category' | 'type')}
                  className="px-3 py-2 text-sm border-r border-border bg-muted"
                  title="Search scope"
                >
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="type">Type</option>
                </select>
                <input
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 rounded-r-md bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setShowModal(true)
                }}
                className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm"
              >
                Add Product
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[...products]
                .filter(p => {
                  const q = searchText.trim().toLowerCase()
                  if (!q) return true
                  if (searchScope === 'product') {
                    return (p.product ?? '').toLowerCase().includes(q)
                  }
                  if (searchScope === 'category') {
                    return (p.category ?? '').toLowerCase().includes(q)
                  }
                  return (p.type ?? '').toLowerCase().includes(q)
                })
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setEditing(p)
                      setShowModal(true)
                    }}
                    className="text-left rounded-lg border border-border bg-card text-card-foreground hover:bg-muted transition-colors overflow-hidden"
                    title="Edit product"
                  >
                    <div className="w-full">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.product} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-background" />
                      )}
                        <div className="p-4 space-y-1">
                          <div className="text-base font-semibold">{p.product}</div>
                          <div className="text-sm text-muted-foreground">
                            {p.category} • {p.type}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center mt-2">
                            <div className="rounded border border-border p-1">
                              <div className="text-[10px] text-muted-foreground uppercase">Qty</div>
                              <div className="text-sm font-medium">{p.qty ?? 0}</div>
                            </div>
                            <div className="rounded border border-border p-1">
                              <div className="text-[10px] text-muted-foreground uppercase">Sold</div>
                              <div className="text-sm font-medium">{soldTotals[p.product] ?? 0}</div>
                            </div>
                            <div className={`rounded border border-border p-1 ${(() => {
                              const val = (p.qty ?? 0) - (soldTotals[p.product] ?? 0)
                              if (val <= 0) return 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                              if (val < 50) return 'bg-red-200 dark:bg-red-900 text-foreground border-red-200 dark:border-red-900'
                              if (val < 76) return 'bg-orange-200 dark:bg-orange-900 text-foreground border-orange-200 dark:border-orange-900'
                              if (val < 100) return 'bg-yellow-200 dark:bg-yellow-900 text-foreground border-yellow-200 dark:border-yellow-900'
                              return 'bg-green-200 dark:bg-green-900 text-foreground border-green-200 dark:border-green-900'
                            })()}`}>
                              <div className={`text-[10px] uppercase ${(() => {
                                const val = (p.qty ?? 0) - (soldTotals[p.product] ?? 0)
                                if (val <= 0) return 'text-white/70 dark:text-black/70'
                                return 'text-foreground/70'
                              })()}`}>Available</div>
                              <div className={`font-medium ${((p.qty ?? 0) - (soldTotals[p.product] ?? 0)) <= 0 ? 'text-[10px] leading-4' : 'text-sm'}`}>
                                {(() => {
                                  const val = (p.qty ?? 0) - (soldTotals[p.product] ?? 0)
                                  if (val <= 0) return 'Out of Stock'
                                  return val
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
            {showModal && (
              <InventoryModal
                initial={editing ?? undefined}
                onClose={() => {
                  setShowModal(false)
                  setEditing(null)
                }}
                onSaved={saved => {
                  setProducts(prev => {
                    const exists = prev.findIndex(x => x.id === saved.id)
                    if (exists >= 0) {
                      const next = [...prev]
                      next[exists] = saved
                      return next
                    }
                    return [saved, ...prev]
                  })
                  setShowModal(false)
                  setEditing(null)
                }}
              />
            )}
          </div>
        )}
        {name === 'Expenses' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpenseTabMain('Products')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Products' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Products"
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Government Expenses')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Government Expenses' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Government Expenses"
              >
                Government Expenses
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Petrol')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Petrol' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Petrol"
              >
                Petrol
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Food')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Food' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Food"
              >
                Food
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Materials')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Materials' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Materials"
              >
                Materials
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Parking')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Parking' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Parking"
              >
                Parking
              </button>
              <button
                type="button"
                onClick={() => setExpenseTabMain('Ads')}
                className={`rounded-md px-3 py-2 text-sm border ${expenseTabMain === 'Ads' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                title="Ads"
              >
                Ads
              </button>
            </div>
            {expenseTabMain === 'Products' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="ml-auto" />
                  <div className="w-[320px] inline-flex items-stretch rounded-md border border-border bg-background text-foreground">
                    <input
                      type="text"
                      value={searchAddText}
                      onChange={e => setSearchAddText(e.target.value)}
                      placeholder="Search…"
                      className="flex-1 rounded-md bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddMode('Product')
                      setShowAddModal(true)
                      setSearchAddText('')
                    }}
                    className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm"
                    title="Add Expenses"
                  >
                    Add Expenses
                  </button>
                </div>
                <div className="rounded-md border border-border bg-card p-4">
                  <div className="mb-2 font-medium">Product Costing</div>
                  {(() => {
                    const combined = [...products, ...extraProducts]
                    return (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {combined
                      .filter(p => {
                        const q = searchAddText.trim().toLowerCase()
                        if (!q) return true
                        return (p.product ?? '').toLowerCase().includes(q)
                      })
                      .sort((a, b) => {
                        const catA = (a.category ?? '').toLowerCase()
                        const catB = (b.category ?? '').toLowerCase()
                        const byCat = catA.localeCompare(catB)
                        if (byCat !== 0) return byCat
                        const typeA = (a.type ?? '').toLowerCase()
                        const typeB = (b.type ?? '').toLowerCase()
                        const byType = typeA.localeCompare(typeB)
                        if (byType !== 0) return byType
                        return (a.product ?? '').localeCompare(b.product ?? '')
                      })
                      .map(p => {
                        const t = (p.type ?? '').toLowerCase()
                        const unit = t.includes('printed') ? 25 : t.includes('plain') ? 16.3 : 0
                        const total = (p.qty ?? 0) * unit
                        return (
                          <div
                            key={`exp-${p.id}`}
                            className="text-left rounded-md border border-border bg-background p-3"
                          >
                            <div className="flex items-center gap-3">
                              {p.image_url ? (
                                <img src={p.image_url ?? ''} alt={p.product} className="h-12 w-12 object-cover rounded-md border border-border" />
                              ) : (
                                <div className="h-12 w-12 rounded-md border border-border bg-muted" />
                              )}
                              <div className="min-w-0">
                                <div className="text-sm font-semibold break-words whitespace-normal">{p.product}</div>
                                <div className="text-xs text-muted-foreground">{p.category || '—'} • {p.type || '—'}</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                              <div className="rounded-md border border-border p-2">
                                <div className="text-xs text-muted-foreground">Qty</div>
                                <div className="font-medium">{p.qty ?? 0}</div>
                              </div>
                              <div className="rounded-md border border-border p-2">
                                <div className="text-xs text-muted-foreground">Unit Cost</div>
                                <div className="font-medium">₱{unit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              </div>
                              <div className="rounded-md border border-border p-2">
                                <div className="text-xs text-muted-foreground">Total Cost</div>
                                <div className="font-medium">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    )
                  })()}
                  <div className="mt-3 text-sm font-semibold">
                    Total Expense: ₱{expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="ml-auto" />
                  <div className="w-[320px] inline-flex items-stretch rounded-md border border-border bg-background text-foreground">
                    <input
                      type="text"
                      value={searchAddText}
                      onChange={e => setSearchAddText(e.target.value)}
                      placeholder="Search…"
                      className="flex-1 rounded-md bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddMode('Category')
                      setShowAddModal(true)
                      setSearchAddText('')
                    }}
                    className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm"
                    title="Add Expenses"
                  >
                    Add Expenses
                  </button>
                </div>
                <div className="rounded-md border border-border bg-card p-4 space-y-3">
                  <div className="font-medium">{expenseTabMain}</div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {(catExpenses[expenseTabMain] ?? [])
                      .filter(it => {
                        const q = searchAddText.trim().toLowerCase()
                        if (!q) return true
                        return (it.name ?? '').toLowerCase().includes(q)
                      })
                      .map(it => (
                      <div key={`cat-exp-${expenseTabMain}-${it.id}`} className="rounded-md border border-border bg-background p-3">
                        <div className="font-semibold">{it.name}</div>
                        <div className="text-xs text-muted-foreground">{it.date || '—'}</div>
                        <div className="mt-2 text-sm">₱{it.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCatExpenses(prev => {
                                const arr = prev[expenseTabMain] ?? []
                                const nextArr = arr.filter(x => x.id !== it.id)
                                const out = { ...prev, [expenseTabMain]: nextArr }
                                try {
                                  localStorage.setItem('catExpenses', JSON.stringify(out))
                                } catch {
                                  void 0
                                }
                                return out
                              })
                            }}
                            className="rounded-md border border-border bg-muted px-2 py-1 text-xs"
                            title="Remove"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-semibold">
                    Total: ₱{((catExpenses[expenseTabMain] ?? []).reduce((s, i) => s + i.amount, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </>
            )}
            {showAddModal && (
              <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-3xl rounded-lg border border-border bg-card text-card-foreground shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="font-medium">Add Expenses</div>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="rounded-md border border-border bg-muted px-2 py-1 text-sm"
                        title="Close"
                      >
                        Close
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      {addMode === 'Product' ? (
                        <>
                          {(() => {
                            const suggestions = [...products, ...extraProducts].filter(p => {
                              const q = searchAddText.trim().toLowerCase()
                              if (!q) return true
                              return (p.product ?? '').toLowerCase().includes(q)
                            })
                            if (suggestions.length === 0) return null
                            return (
                              <div className="max-h-[40vh] overflow-auto rounded-md border border-border bg-background">
                                <div className="grid gap-2 p-2 sm:grid-cols-2 xl:grid-cols-3">
                                  {suggestions.map(p => (
                                    <button
                                      key={`add-sugg-${p.id}`}
                                      type="button"
                                      onClick={() => {
                                        setNewProdName(p.product)
                                        const t = (p.type ?? '').toLowerCase()
                                        setNewProdType(t.includes('printed') ? 'Printed' : 'Plain')
                                        setNewProdQty(String(p.qty ?? 1))
                                      }}
                                      className="text-left rounded-md border border-border bg-muted p-2 hover:bg-accent transition-colors"
                                      title="Use this product"
                                    >
                                      <div className="text-sm font-medium break-words whitespace-normal">{p.product}</div>
                                      <div className="text-xs text-muted-foreground">{p.type}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}
                          <div className="grid md:grid-cols-3 gap-2">
                            <input
                              value={newProdName}
                              onChange={e => setNewProdName(e.target.value)}
                              placeholder="Product name"
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            />
                            <select
                              value={newProdType}
                              onChange={e => setNewProdType(e.target.value as 'Plain' | 'Printed')}
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                              title="Type"
                            >
                              <option value="Plain">Plain</option>
                              <option value="Printed">Printed</option>
                            </select>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={newProdQty}
                              onChange={e => setNewProdQty(e.target.value)}
                              placeholder="Qty"
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const name = newProdName.trim()
                                const qtyNum = Number(newProdQty)
                                if (!name || !Number.isFinite(qtyNum) || qtyNum <= 0) return
                                const item: ProductItem = {
                                  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                  category: '',
                                  type: newProdType,
                                  product: name,
                                  qty: qtyNum,
                                  image_url: null,
                                }
                                setExtraProducts(prev => {
                                  const out = [...prev, item]
                                  try {
                                    localStorage.setItem('expensesProductsExtra', JSON.stringify(out))
                                  } catch {
                                    void 0
                                  }
                                  return out
                                })
                                setNewProdName('')
                                setNewProdQty('')
                                setShowAddModal(false)
                              }}
                              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
                            >
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {(() => {
                            const suggestions = (catExpenses[expenseTabMain] ?? []).filter(it => {
                              const q = searchAddText.trim().toLowerCase()
                              if (!q) return true
                              return (it.name ?? '').toLowerCase().includes(q)
                            })
                            if (suggestions.length === 0) return null
                            return (
                              <div className="max-h-[40vh] overflow-auto rounded-md border border-border bg-background">
                                <div className="grid gap-2 p-2 sm:grid-cols-2 xl:grid-cols-3">
                                  {suggestions.map(it => (
                                    <button
                                      key={`add-cat-sugg-${expenseTabMain}-${it.id}`}
                                      type="button"
                                      onClick={() => {
                                        setNewExpName(it.name)
                                        setNewExpAmount(String(it.amount))
                                        setNewExpDate(it.date)
                                      }}
                                      className="text-left rounded-md border border-border bg-muted p-2 hover:bg-accent transition-colors"
                                      title="Use this item"
                                    >
                                      <div className="text-sm font-medium break-words whitespace-normal">{it.name}</div>
                                      <div className="text-xs text-muted-foreground">₱{it.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}
                          <div className="grid md:grid-cols-3 gap-2">
                            <input
                              value={newExpName}
                              onChange={e => setNewExpName(e.target.value)}
                              placeholder="Item"
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={newExpAmount}
                              onChange={e => setNewExpAmount(e.target.value)}
                              placeholder="Amount"
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            />
                            <input
                              value={newExpDate}
                              onChange={e => setNewExpDate(e.target.value)}
                              placeholder="YYYY-MM-DD"
                              className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const name = newExpName.trim()
                                const amountNum = Number(newExpAmount)
                                const date = newExpDate.trim()
                                if (!name || !Number.isFinite(amountNum) || amountNum <= 0) return
                                const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, amount: amountNum, date }
                                setCatExpenses(prev => {
                                  const arr = prev[expenseTabMain] ?? []
                                  const nextArr = [...arr, item]
                                  const out = { ...prev, [expenseTabMain]: nextArr }
                                  try {
                                    localStorage.setItem('catExpenses', JSON.stringify(out))
                                  } catch {
                                    void 0
                                  }
                                  return out
                                })
                                setNewExpName('')
                                setNewExpAmount('')
                                setNewExpDate('')
                                setShowAddModal(false)
                              }}
                              className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
                            >
                              Save
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Product costing modal removed as per request */}
          </div>
        )}
        {name === 'OrderSales' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                {orderSalesSub === 'Shopee'
                  ? ordersShopee.length
                    ? `Shopee: ${ordersShopee.length} rows`
                    : 'Shopee: No data'
                  : ordersTiktok.length
                  ? `Tiktok: ${ordersTiktok.length} rows`
                  : 'Tiktok: No data'}
              </div>
              {unknownCount > 0 && (
                <div className="text-xs rounded-md border border-border bg-muted text-muted-foreground px-2 py-1">
                  {unknownCount} item(s) missing order number
                </div>
              )}
              <div className="ml-auto" />
              {orderSalesSub === 'Shopee' ? (
                <label className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) handleImportShopee(e.target.files)
                      e.currentTarget.value = ''
                    }}
                    className="sr-only"
                  />
                  {importingShopee ? 'Importing…' : 'Import Shopee'}
                </label>
              ) : (
                <label className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) handleImportTiktok(e.target.files)
                      e.currentTarget.value = ''
                    }}
                    className="sr-only"
                  />
                  {importingTiktok ? 'Importing…' : 'Import Tiktok'}
                </label>
              )}
              <div className="w-[320px] inline-flex items-stretch rounded-md border border-border bg-background text-foreground">
                <select
                  value={orderSearchScope}
                  onChange={e => setOrderSearchScope(e.target.value as 'order' | 'buyer' | 'product' | 'all')}
                  className="px-3 py-2 text-sm border-r border-border bg-muted"
                  title="Search scope"
                >
                  <option value="all">All</option>
                  <option value="order">Order Number</option>
                  <option value="buyer">Buyer Username</option>
                  <option value="product">Product</option>
                </select>
                <input
                  type="text"
                  value={orderSearchText}
                  onChange={e => setOrderSearchText(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 rounded-r-md bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddSale(true)}
                className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm"
                title={`Add Sale (${orderSalesSub})`}
              >
                Add Sale ({orderSalesSub})
              </button>
            </div>
            {!ordersData.length ? (
              <div className="rounded-md border border-border bg-muted text-muted-foreground p-4 text-sm">
                No data loaded. Use the Import button above to load orders.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[...orders]
                  .filter(order => {
                    const q = orderSearchText.trim().toLowerCase()
                    if (!q) return true
                    if (orderSearchScope === 'order') return String(order.orderId).toLowerCase().includes(q)
                    if (orderSearchScope === 'buyer') return String(order.buyer ?? '').toLowerCase().includes(q)
                    if (orderSearchScope === 'product') return order.items.some(it => displayName(it.product).toLowerCase().includes(q))
                    return (
                      String(order.orderId).toLowerCase().includes(q) ||
                      String(order.buyer ?? '').toLowerCase().includes(q) ||
                      order.items.some(it => displayName(it.product).toLowerCase().includes(q))
                    )
                  })
                  .map(order => (
                  <div
                    key={order.orderId}
                    onClick={() => setEditingOrder(order)}
                    className="cursor-pointer rounded-lg border border-border bg-card text-card-foreground overflow-hidden"
                    title="Edit order"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="font-medium">Order {order.orderId}</div>
                      <div className="text-xs text-muted-foreground">{formatDateDisplay(order.date)}</div>
                    </div>
                    <div className="p-3 space-y-2">
                      {(() => {
                        const idx = Math.min(Math.max((carousel[order.orderId] ?? 0), 0), order.items.length - 1)
                        const it = order.items[idx]
                        return (
                          <>
                            <div className="flex items-center gap-3 rounded-md border border-border bg-background p-2">
                              {it.image_url ? (
                                <img src={it.image_url} alt={it.product} className="h-12 w-12 object-cover rounded-md border border-border" />
                              ) : (
                                <div className="h-12 w-12 rounded-md border border-border bg-muted" />
                              )}
                              <div className="min-w-0">
                                <div className="text-sm font-semibold break-words whitespace-normal">{displayName(it.product)}</div>
                                <div className="text-xs text-muted-foreground">Qty {it.qty}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              {order.items.map((_, i) => (
                                <button
                                  key={`card-dot-${order.orderId}-${i}`}
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation()
                                    setCarousel(c => ({ ...c, [order.orderId]: i }))
                                  }}
                                  className={`h-2.5 w-2.5 rounded-full ${idx === i ? 'bg-primary' : 'bg-muted border border-border'}`}
                                  title={`Go to item ${i + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={[
                            'rounded-full px-2 py-1 text-xs',
                            (() => {
                              const s = (order.status || '').toLowerCase()
                              if (s.includes('completed')) return 'bg-green-600 text-white'
                              if (s.includes('cancel') || s.includes('return')) return 'bg-red-600 text-white'
                              return 'bg-yellow-500 text-black'
                            })(),
                          ].join(' ')}
                        >
                          {order.status || '—'}
                        </div>
                        {(order.status || '').toLowerCase().includes('completed') && (
                          <div className="text-xs text-muted-foreground">
                            Released Date: {formatDateDisplay(order.date)}
                          </div>
                        )}
                        {(order.status || '').toLowerCase().includes('delivered') && (
                          <div className="text-xs text-muted-foreground">
                            Estimated to be released: 3-7days
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        ₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showAddSale && (
              <AddSaleModal
                platform={orderSalesSub}
                onClose={() => setShowAddSale(false)}
                productItems={products.map(p => ({ category: p.category, type: p.type, product: p.product }))}
                onSaved={async rows => {
                  if (orderSalesSub === 'Shopee') {
                    setOrdersShopee(prev => [...(rows as Row[]), ...prev])
                  } else {
                    setOrdersTiktok(prev => [...(rows as Row[]), ...prev])
                  }
                  await syncInventoryFromRows(rows as Row[], orderSalesSub)
                  try {
                    const first = (rows as Row[])[0] ?? {}
                    const st = String(first['Status'] ?? '').toLowerCase()
                    if (/cancel|return|failed|cut/.test(st)) {
                       const cEntry = {
                         id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                         date: String(first['DATE'] ?? ''),
                         orderId: String(first['Order Number'] ?? ''),
                         product: String(first['Product Name'] ?? ''),
                         platform: orderSalesSub,
                         status: String(first['Status'] ?? ''),
                         qty: toNum(String(first['Quantity'] ?? '1'), 1),
                       }
                       setKosiedonCutsEntries(prev => {
                         const merged = [...prev]
                         if (!merged.find(m => m.orderId === cEntry.orderId)) {
                           merged.push(cEntry)
                         }
                         try { localStorage.setItem('kosiedonCutsEntries', JSON.stringify(merged)) } catch { void 0 }
                         return merged
                       })
                    }

                    const taxAmt = toNum(String(first['Tax'] ?? '0'), 0)
                    if (taxAmt !== 0) {
                      const entry = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        date: String(first['DATE'] ?? ''),
                        orderId: String(first['Order Number'] ?? ''),
                        type: 'ShopTax',
                        amount: taxAmt,
                        platform: orderSalesSub,
                      }
                      setTaxationEntries(prev => {
                        const merged = [...prev]
                        const idx = merged.findIndex(e => e.orderId === entry.orderId)
                        if (idx !== -1) {
                          merged[idx] = {
                            ...merged[idx],
                            amount: entry.amount,
                            date: entry.date || merged[idx].date,
                            platform: entry.platform || merged[idx].platform,
                          }
                        } else {
                          merged.push(entry)
                        }
                        try {
                          localStorage.setItem('taxationEntries', JSON.stringify(merged))
                        } catch {
                          void 0
                        }
                        return merged
                      })
                    }
                  } catch {
                    void 0
                  }
                  setShowAddSale(false)
                }}
              />
            )}

            {editingOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-3xl rounded-lg border border-border bg-card text-card-foreground overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="font-medium">Order {editingOrder.orderId}</div>
                    <button
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="inline-flex items-center rounded-md border border-border bg-muted text-foreground px-2 py-1 text-xs"
                      title="Close"
                    >
                      Close
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditTab('order')}
                        className={`rounded-md px-3 py-2 text-sm border ${editTab === 'order' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                      >
                        Order Information
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTab('buyer')}
                        className={`rounded-md px-3 py-2 text-sm border ${editTab === 'buyer' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                      >
                        Buyer Information
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditTab('payment')}
                        className={`rounded-md px-3 py-2 text-sm border ${editTab === 'payment' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}
                      >
                        Payment Information
                      </button>
                    </div>
                    <div className="max-h-[50vh] overflow-auto rounded-md border border-border p-3">
                      {(() => {
                        const baseRow = editingOrder.items[0].sourceRow
                        const headers =
                          ordersHeaders.length
                            ? ordersHeaders
                            : Object.keys(baseRow).map((header, index) => ({ col: '', header, index }))
                        return (
                          <>
                            {editTab === 'order' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(() => {
                            const { key: idKey, value: idVal } = getCell(baseRow, [
                              'Order ID',
                              'Order Number',
                              'Order No',
                              'OrderID',
                              'Order number',
                            ])
                            const { key: stKey, value: stVal } = getCell(baseRow, ['Status'])
                            const orderNumber = ordersEdits[editingOrder.orderId]?.[(idKey ?? 'Order Number')] ?? (idVal || editingOrder.orderId)
                            const statusVal = ordersEdits[editingOrder.orderId]?.[(stKey ?? 'Status')] ?? (stVal || editingOrder.status)
                            return (
                              <>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Order Number</div>
                                  <input
                                    value={orderNumber}
                                    onChange={e =>
                                      setOrdersEdits(prev => {
                                        const next = { ...(prev[editingOrder.orderId] || {}) }
                                        next[(idKey ?? 'Order Number')] = e.target.value
                                        return { ...prev, [editingOrder.orderId]: next }
                                      })
                                    }
                                    className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Status</div>
                                  <div className="border border-border rounded-md bg-background">
                                    <button
                                      type="button"
                                      onClick={() => setStatusAccordionOpen(!statusAccordionOpen)}
                                      className="w-full flex items-center justify-between px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    >
                                      <span>{statusVal || 'Select Status'}</span>
                                      <span className={`text-xs opacity-50 transition-transform ${statusAccordionOpen ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    {statusAccordionOpen && (
                                      <div className="border-t border-border p-2 grid grid-cols-2 gap-2 bg-muted/20">
                                        {['Unpaid', 'To Ship', 'Shipping', 'Delivered', 'Completed', 'Cancelled', 'Returned', 'Failed Delivery'].map(s => (
                                          <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                              setOrdersEdits(prev => {
                                                const next = { ...(prev[editingOrder.orderId] || {}) }
                                                next[(stKey ?? 'Status')] = s
                                                return { ...prev, [editingOrder.orderId]: next }
                                              })
                                              setStatusAccordionOpen(false)
                                            }}
                                            className={`text-xs px-2 py-2 rounded-md border transition-colors ${
                                              (statusVal || '').toLowerCase() === s.toLowerCase()
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background hover:bg-accent hover:text-accent-foreground border-border'
                                            }`}
                                          >
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )
                          })()}
                          {headers
                            .filter(h => h.index >= 0 && h.index <= 4)
                            .filter(h => !isOrderNumberHeader(h.header) && !isStatusHeader(h.header))
                            .map(h => {
                              const base = editingOrder.items[0].sourceRow
                              const raw = String((base as unknown as Record<string, unknown>)[h.header] ?? '')
                              const display = isDateHeader(h.header) ? formatDateDisplay(raw) : raw
                              const current = ordersEdits[editingOrder.orderId]?.[h.header] ?? display
                              return (
                                <div key={`AE-${h.header}`} className="space-y-1">
                                  <div className="text-xs text-muted-foreground">{h.header}</div>
                                  <input
                                    value={current}
                                    onChange={e =>
                                      setOrdersEdits(prev => {
                                        const next = { ...(prev[editingOrder.orderId] || {}) }
                                        next[h.header] = e.target.value
                                        return { ...prev, [editingOrder.orderId]: next }
                                      })
                                    }
                                    className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                  />
                                </div>
                              )
                            })}
                          </div>
                            )}
                            {editTab === 'buyer' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Buyer Username</div>
                              <input
                                value={buyerUsernames[editingOrder.orderId] ?? ''}
                                onChange={e =>
                                  setBuyerUsernames(prev => ({ ...prev, [editingOrder.orderId]: e.target.value }))
                                }
                                className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                            {headers
                              .filter(h => h.index === 5)
                              .map(h => {
                                const base = editingOrder.items[0].sourceRow
                                const current = ordersEdits[editingOrder.orderId]?.[h.header] ?? String((base as unknown as Record<string, unknown>)[h.header] ?? '')
                                return (
                                  <div key={`F-${h.header}`} className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{h.header}</div>
                                    <input
                                      value={current}
                                      onChange={e =>
                                        setOrdersEdits(prev => {
                                          const next = { ...(prev[editingOrder.orderId] || {}) }
                                          next[h.header] = e.target.value
                                          return { ...prev, [editingOrder.orderId]: next }
                                        })
                                      }
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                    />
                                  </div>
                                )
                              })}
                          </div>
                            )}
                      {editTab === 'payment' && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {orderSalesSub === 'Shopee' ? (
                            <>
                              <div className="sm:col-span-2 space-y-2">
                                <div className="text-sm font-semibold">Products</div>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-1">
                                    {editingOrder.items.map((_, i) => (
                                      <button
                                        key={`edit-dot-${i}`}
                                        type="button"
                                        onClick={() => setProductAccOpen(i)}
                                        className={`h-2.5 w-2.5 rounded-full ${productAccOpen === i ? 'bg-primary' : 'bg-muted border border-border'}`}
                                        title={`Go to item ${i + 1}`}
                                      />
                                    ))}
                                  </div>
                                  {(() => {
                                    const it = editingOrder.items[Math.min(Math.max(productAccOpen, 0), editingOrder.items.length - 1)]
                                    const line = it ? (it.rowTotal > 0 ? it.rowTotal : it.itemPrice * it.qty) : 0
                                    return it ? (
                                      <div className="rounded-md border border-border p-2 space-y-1">
                                        <div className="text-sm font-semibold">
                                          {displayName(it.product)}{it.variation ? ` • ${displayName(it.variation)}` : ''}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Qty {it.qty}</div>
                                        <div className="text-xs text-muted-foreground">
                                          Item ₱{it.itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          Line ₱{line.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                      </div>
                                    ) : null
                                  })()}
                                  <div className="flex items-center justify-between rounded-md border border-border p-2">
                                    <div className="text-xs text-muted-foreground">Estimated Total</div>
                                    <div className="text-sm font-medium">
                                      ₱{editingOrder.items.reduce((sum, it) => {
                                        const line = it.rowTotal > 0 ? it.rowTotal : it.itemPrice * it.qty
                                        return sum + line
                                      }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {(() => {
                                const seen = new Set<string>()
                                const fields: Array<{ label: string; syns: string[] }> = [
                                  { label: 'Item Price', syns: ['Item Price', 'Price'] },
                                  { label: 'Quantity', syns: ['Quantity', 'Qty', 'quanity'] },
                                  { label: 'Total', syns: ['Total'] },
                                  { label: 'Shipping fee paid by buyer', syns: ['Shipping fee paid by buyer'] },
                                  { label: 'Estimated Shipping Fee Charged by Logistic Provider', syns: ['Estimated Shipping Fee Charged by Logistic Provider'] },
                                  { label: 'Shipping fee Rebate', syns: ['Shipping fee Rebate'] },
                                  { label: 'Service Fee', syns: ['Service Fee'] },
                                  { label: 'Transaction Fee', syns: ['Transaction Fee'] },
                                  { label: 'Tax', syns: ['Tax'] },
                                  { label: 'Merchandise Subtotal', syns: ['Merchandise Subtotal'] },
                                  { label: 'Shipping Fee', syns: ['Shipping Fee'] },
                                  { label: 'Shopee Voucher', syns: ['Shopee Voucher'] },
                                  { label: 'Seller Voucher', syns: ['Seller Voucher'] },
                                  { label: 'Payment Discount', syns: ['Payment discount', 'Payment DIscount', 'Payment Discount'] },
                                  { label: 'Shopee coin redeem', syns: ['Shopee coin redeem', 'Shopee Coins Redeemed'] },
                                  { label: 'Total Buyer Payment', syns: ['Total Buyer Payment'] },
                                ]
                                return fields.map(f => {
                                  const { key, value } = getCell(baseRow, f.syns)
                                  const k = key ?? f.label
                                  if (key && seen.has(key)) return null
                                  if (key) seen.add(key)
                                  const current = ordersEdits[editingOrder.orderId]?.[k] ?? value
                                  return (
                                    <div key={`S-${f.label}`} className="space-y-1">
                                      <div className="text-xs text-muted-foreground">{f.label}</div>
                                      <input
                                        value={current || '—'}
                                        onChange={e =>
                                          setOrdersEdits(prev => {
                                            const next = { ...(prev[editingOrder.orderId] || {}) }
                                            next[k] = e.target.value
                                            return { ...prev, [editingOrder.orderId]: next }
                                          })
                                        }
                                        className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                      />
                                    </div>
                                  )
                                })
                              })()}
                            </>
                          ) : (
                            headers
                              .filter(h => h.index >= 6 && h.index <= 23)
                              .map(h => {
                                const base = editingOrder.items[0].sourceRow
                                const current = ordersEdits[editingOrder.orderId]?.[h.header] ?? String((base as unknown as Record<string, unknown>)[h.header] ?? '')
                                return (
                                  <div key={`GX-${h.header}`} className="space-y-1">
                                    <div className="text-xs text-muted-foreground">{h.header}</div>
                                    <input
                                      value={current}
                                      onChange={e =>
                                        setOrdersEdits(prev => {
                                          const next = { ...(prev[editingOrder.orderId] || {}) }
                                          next[h.header] = e.target.value
                                          return { ...prev, [editingOrder.orderId]: next }
                                        })
                                      }
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                                    />
                                  </div>
                                )
                              })
                          )}
                          </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      {saveError && <div className="text-xs text-destructive">{saveError}</div>}
                      <button
                        type="button"
                        onClick={async () => {
                          if (!editingOrder) return
                          setSavingOrder(true)
                          setSaveError(null)
                          try {
                            const payload = {
                              order_id: editingOrder.orderId,
                              buyer_username: buyerUsernames[editingOrder.orderId] ?? '',
                              edits_json: JSON.stringify(ordersEdits[editingOrder.orderId] ?? {}),
                              platform: orderSalesSub,
                            }
                            if (isSupabaseConfigured) {
                              const { error } = await supabase!
                                .from('orders_meta')
                                .upsert([payload], { onConflict: 'order_id' })
                              if (error) throw error
                            }
                            setEditingOrder(null)
                          } catch (err: unknown) {
                            setSaveError(err instanceof Error ? err.message : 'Failed to save')
                          } finally {
                            setSavingOrder(false)
                          }
                        }}
                        className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
                        disabled={savingOrder}
                      >
                        {savingOrder ? 'Saving…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingOrder(null)}
                        className="rounded-md bg-muted text-foreground border border-border px-3 py-2 text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {name === 'CashFlow' && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  {errorCashFlow ? errorCashFlow : cashFlowRows.length ? `CashFlow: ${cashFlowRows.length} rows` : 'CashFlow: No data'}
                </div>
                {cashFlowRows.length > 0 && (
                  <button
                    onClick={() => setCashFlowRows([])}
                    className="ml-2 text-xs text-destructive hover:underline"
                  >
                    Clear
                  </button>
                )}
                <div className="ml-auto" />
                <label className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) handleImportCashFlow(e.target.files)
                      e.currentTarget.value = ''
                    }}
                    className="sr-only"
                  />
                  {importingCashFlow ? 'Importing…' : 'Import Excel'}
                </label>
              </div>
              {!cashFlowRows.length ? (
                <div className="rounded-md border border-border bg-muted text-muted-foreground p-4 text-sm">
                  No data loaded. Import a CashFlow Excel file.
                </div>
              ) : (
                <div className="rounded-md border border-border overflow-auto overflow-x-auto max-h-[600px]">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
                      <tr>
                        <th className="text-left px-3 py-2">Date</th>
                        <th className="text-left px-3 py-2">Type</th>
                        <th className="text-left px-3 py-2">Description</th>
                        <th className="text-left px-3 py-2">Order ID</th>
                        <th className="text-left px-3 py-2">Money Direction</th>
                        <th className="text-left px-3 py-2">Amount</th>
                        <th className="text-left px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashFlowRows.map((r, i) => {
                        const d = formatDateDisplay(field(r, ['DATE', 'Date'], ''))
                        const t = field(r, ['Type'], '')
                        const desc = field(r, ['Description'], '')
                        const oid = field(r, ['Order ID', 'Order Number', 'Order No'], '')
                        const mf = field(r, ['Money Direction', 'Money Flow'], '')
                        const amt = toNum(field(r, ['Amount'], '0'), 0)
                        const st = field(r, ['Status'], '')
                        return (
                          <tr key={`CF-${i}`} className="border-t border-border">
                            <td className="px-3 py-2">{d}</td>
                            <td className="px-3 py-2">{t}</td>
                            <td className="px-3 py-2">{desc}</td>
                            <td className="px-3 py-2">{oid}</td>
                            <td className="px-3 py-2">{mf}</td>
                            <td className="px-3 py-2">₱{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2">{st}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {name === 'Taxation' && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-card p-4 space-y-3">
              <div className="font-medium">Taxation</div>
              <div className="text-xs text-muted-foreground">
                ShopTax entries from sales
              </div>
              <div className="rounded-md border border-border bg-background max-h-[60vh] overflow-auto overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Order ID</th>
                      <th className="text-left px-3 py-2">Type</th>
                      <th className="text-left px-3 py-2">Platform</th>
                      <th className="text-left px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxationEntries.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">
                          No taxation entries
                        </td>
                      </tr>
                    ) : (
                      taxationEntries.map((t, i) => (
                        <tr key={`TX-${t.id}-${i}`} className="border-t border-border">
                          <td className="px-3 py-2">{formatDateDisplay(t.date)}</td>
                          <td className="px-3 py-2">{t.orderId}</td>
                          <td className="px-3 py-2">{t.type}</td>
                          <td className="px-3 py-2">{t.platform}</td>
                          <td className="px-3 py-2">₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="rounded-md border border-border bg-background p-3">
                {(() => {
                  const total = taxationEntries.reduce((sum, t) => sum + t.amount, 0)
                  return (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Tax:</span>{' '}
                      <span className="font-semibold">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
        {name === 'KosiedonCuts' && (
          <div className="space-y-4">
            <div className="rounded-md border border-border bg-card p-4 space-y-3">

              <div className="flex items-center gap-2 border-b border-border pb-2">
                <button
                  onClick={() => setKosiedonTab('Returned')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    kosiedonTab === 'Returned'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  Returned
                </button>
                <button
                  onClick={() => setKosiedonTab('Cutted')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    kosiedonTab === 'Cutted'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  Cutted
                </button>
              </div>
              {kosiedonTab === 'Cutted' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddCutted(true)}
                    className="rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm"
                  >
                    Add Cutted
                  </button>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {kosiedonTab} orders from OrderSales
              </div>
              <div className="rounded-md border border-border bg-background max-h-[60vh] overflow-auto overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      {kosiedonTab === 'Returned' && <th className="text-left px-3 py-2">Order ID</th>}
                      <th className="text-left px-3 py-2">Product</th>
                      <th className="text-left px-3 py-2">Quantity</th>
                      {kosiedonTab === 'Returned' && <th className="text-left px-3 py-2">Platform</th>}
                      {kosiedonTab === 'Returned' && <th className="text-left px-3 py-2">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = kosiedonCutsEntries.filter(k => {
                        const s = (k.status || '').toLowerCase()
                        if (kosiedonTab === 'Returned') return s.includes('return')
                        if (kosiedonTab === 'Cutted') return s.includes('cut')
                        return false
                      })

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={kosiedonTab === 'Returned' ? 6 : 3} className="px-3 py-4 text-center text-muted-foreground">
                              No {kosiedonTab.toLowerCase()} orders
                            </td>
                          </tr>
                        )
                      }
                      return filtered.map((k, i) => (
                        <tr key={`KC-${k.id}-${i}`} className="border-t border-border">
                          <td className="px-3 py-2">{formatDateDisplay(k.date)}</td>
                          {kosiedonTab === 'Returned' && <td className="px-3 py-2">{k.orderId}</td>}
                          <td className="px-3 py-2">{k.product}</td>
                          <td className="px-3 py-2">{k.qty || 1}</td>
                          {kosiedonTab === 'Returned' && <td className="px-3 py-2">{k.platform}</td>}
                          {kosiedonTab === 'Returned' && (
                            <td className="px-3 py-2">
                              <button
                                onClick={() => {
                                  // Action: Shipped -> Deduct inventory and remove from list
                                  if (confirm('Mark as Shipped? This will deduct inventory.')) {
                                    const qtyToDeduct = k.qty || 1
                                    // 1. Deduct inventory
                                     setProducts(prev => {
                                       const next = prev.map(p => {
                                         // Fuzzy match product
                                         if (p.product === k.product || p.product.includes(k.product)) {
                                           return { ...p, qty: Math.max(0, p.qty - qtyToDeduct) }
                                         }
                                         return p
                                       })
                                       if (isSupabaseConfigured) {
                                          const p = next.find(x => x.product === k.product || x.product.includes(k.product))
                                          if (p) {
                                            supabase!.from('inventory').update({ qty: p.qty }).eq('product', p.product).then(() => {})
                                          }
                                       }
                                       return next
                                     })
                                    // 2. Remove from list
                                    setKosiedonCutsEntries(prev => {
                                      const next = prev.filter(x => x.id !== k.id)
                                      localStorage.setItem('kosiedonCutsEntries', JSON.stringify(next))
                                      return next
                                    })
                                  }
                                }}
                                className="rounded-md bg-primary text-primary-foreground px-2 py-1 text-xs"
                              >
                                Shipped
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            {showAddCutted && (
              <AddCuttedModal
                products={products}
                onClose={() => setShowAddCutted(false)}
                onSaved={entry => {
                  setKosiedonCutsEntries(prev => {
                    const next = [...prev, { ...entry, platform: 'Manual' as const }]
                    try {
                      localStorage.setItem('kosiedonCutsEntries', JSON.stringify(next))
                    } catch {
                      void 0
                    }
                    return next
                  })
                  // Deduct from inventory
                  const cutQty = toNum(String(entry.qty), 0)
                  setProducts(prev => {
                    const next = prev.map(p => {
                      if (p.product === entry.product) {
                        const current = toNum(String(p.qty), 0)
                        return { ...p, qty: Math.max(0, current - cutQty) }
                      }
                      return p
                    })
                    
                    if (isSupabaseConfigured) {
                      const p = next.find(x => x.product === entry.product)
                      if (p) {
                         supabase!.from('inventory').update({ qty: p.qty }).eq('product', entry.product).then(() => {})
                      }
                    }
                    return next
                  })
                }}
              />
            )}
          </div>
        )}
        {name === 'Account Settings' && (
          <div className="space-y-4">
            <form className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Display Name</label>
                <input className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm">
                  Save Settings
                </button>
                <button type="button" onClick={() => window.location.reload()} className="rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm">
                  Logout
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function InventoryModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: {
    id: string
    category: string
    type: string
    product: string
    qty: number
    image_url: string | null
  }
  onClose: () => void
  onSaved: (item: {
    id: string
    category: string
    type: string
    product: string
    qty: number
    image_url: string | null
  }) => void
}) {
  const [category, setCategory] = useState(initial?.category ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [product, setProduct] = useState(initial?.product ?? '')
  const [qty, setQty] = useState<number>(initial?.qty ?? 0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial?.image_url ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let imageUrl = previewUrl ?? null
      let id = initial?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      if (isSupabaseConfigured) {
        try {
          if (imageFile) {
            const path = `inventory/${Date.now()}-${imageFile.name}`
            const upload = await supabase!.storage.from('images').upload(path, imageFile)
            if (upload.error) throw upload.error
            const publicUrl = supabase!.storage.from('images').getPublicUrl(path)
            imageUrl = publicUrl.data.publicUrl
          }
          if (initial?.id) {
            const { error: upError } = await supabase!
              .from('inventory')
              .update({
                category,
                type,
                product,
                qty,
                image_url: imageUrl,
              })
              .eq('id', initial.id)
            if (upError) throw upError
            id = initial.id
          } else {
            const { data, error: insError } = await supabase!
              .from('inventory')
              .insert({
                category,
                type,
                product,
                qty,
                image_url: imageUrl,
              })
              .select()
              .limit(1)
            if (insError) throw insError
            id = (data?.[0]?.id as string) ?? id
          }
        } catch {
          /* fall back to local save */
        }
      }
      onSaved({
        id,
        category,
        type,
        product,
        qty,
        image_url: imageUrl,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-lg border border-border bg-card text-card-foreground shadow-lg">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="font-medium">{initial ? 'Edit Product' : 'Add Product'}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-muted px-2 py-1 text-sm"
            >
              Close
            </button>
          </div>
          <form onSubmit={onSubmit} className="p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <input
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <input
                  value={type}
                  onChange={e => setType(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Product</label>
                <input
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Qty</label>
                <input
                  type="number"
                  min={0}
                  value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                  required
                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Image upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2"
              />
              {previewUrl && (
                <img src={previewUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-md border border-border" />
              )}
            </div>
            {error && (
              <div className="rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-md bg-muted text-foreground px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-2 font-medium disabled:opacity-50"
              >
                {loading ? 'Saving…' : initial ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      role="switch"
      className="inline-flex items-center rounded-full border border-border h-9 w-20 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-muted to-accent" />
      {!isDark && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {isDark && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
          </svg>
        </span>
      )}
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-card shadow-sm border border-border transition-all ${
          isDark ? 'right-1' : 'left-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {isDark ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </span>
    </button>
  )
}
