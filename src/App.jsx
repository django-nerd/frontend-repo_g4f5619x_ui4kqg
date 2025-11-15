import { useState } from 'react'

function App() {
  const [form, setForm] = useState({
    name: '',
    condition: 'new',
    category: 'Elektronik',
    price: '',
    description: '',
  })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setImage(file || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      alert('Mohon unggah gambar')
      return
    }

    const data = new FormData()
    data.append('name', form.name)
    data.append('condition', form.condition)
    data.append('category', form.category)
    data.append('price', form.price)
    data.append('description', form.description)
    data.append('image', image)

    try {
      setLoading(true)
      const res = await fetch(`${backend}/api/items`, {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal menyimpan')
      setResult(json)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Master Data Barang</h1>
        <p className="text-gray-600 mb-6">Form input dengan 6 field: text, radio, select, number, textarea, dan upload file.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Text input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contoh: Laptop Asus"
            />
          </div>

          {/* Radio group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={form.condition === 'new'}
                  onChange={handleChange}
                />
                <span>Baru</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={form.condition === 'used'}
                  onChange={handleChange}
                />
                <span>Bekas</span>
              </label>
            </div>
          </div>

          {/* Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Elektronik</option>
              <option>Peralatan Rumah</option>
              <option>Pakaian</option>
              <option>Olahraga</option>
            </select>
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tulis detail barang..."
            />
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <input type="file" accept="image/*" onChange={handleFile} required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan Barang'}
          </button>
        </form>

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Berhasil disimpan!</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Nama:</strong> {result.name}</li>
              <li><strong>Kondisi:</strong> {result.condition}</li>
              <li><strong>Kategori:</strong> {result.category}</li>
              <li><strong>Harga:</strong> Rp {Number(result.price).toLocaleString('id-ID')}</li>
              <li><strong>Deskripsi:</strong> {result.description || '-'}</li>
              <li><strong>Gambar:</strong> {result.image_url}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
