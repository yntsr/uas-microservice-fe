import { useState } from 'react';
import { productsAPI } from '../api';
import Toast from './Toast';

const Products = ({ products, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: 0 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        showToast('Produk berhasil diperbarui');
      } else {
        await productsAPI.create(formData);
        showToast('Produk berhasil ditambahkan');
      }
      closeModal();
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal menyimpan produk', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    setDeletingId(id);
    try {
      await productsAPI.delete(id);
      showToast('Produk berhasil dihapus');
      onRefresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Gagal menghapus produk', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Manajemen Produk</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => openModal()}
          disabled={isSubmitting || deletingId !== null}
        >
          + Tambah Produk
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">Belum ada produk</td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.description || '-'}</td>
                    <td>Rp {formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn btn-primary btn-icon" 
                          onClick={() => openModal(product)}
                          disabled={deletingId === product.id || isSubmitting}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id || isSubmitting}
                        >
                          {deletingId === product.id ? (
                            <span className="btn-spinner"></span>
                          ) : (
                            '🗑️'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="products-grid">
        {products.length === 0 ? (
          <div className="empty-state">Belum ada produk</div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="product-card">
              <div className="product-card-header">
                <h3 className="product-card-title">{product.name}</h3>
                <span className="product-card-id">#{index + 1}</span>
              </div>
              <div className="product-card-body">
                <p className="product-card-description">{product.description || 'Tidak ada deskripsi'}</p>
                <div className="product-card-price">Rp {formatCurrency(product.price)}</div>
                <div className="product-card-stock">Stok: {product.stock}</div>
              </div>
              <div className="product-card-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => openModal(product)}
                  disabled={deletingId === product.id || isSubmitting}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id || isSubmitting}
                >
                  {deletingId === product.id ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span style={{ marginLeft: '8px' }}>Menghapus...</span>
                    </>
                  ) : (
                    'Hapus'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={isSubmitting ? undefined : closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button 
                className="close-btn" 
                onClick={closeModal}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Produk *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Harga *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span style={{ marginLeft: '8px' }}>
                        {editingProduct ? 'Menyimpan...' : 'Menambahkan...'}
                      </span>
                    </>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Products;
