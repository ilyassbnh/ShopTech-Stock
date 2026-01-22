"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, addSale } from '@/redux/features/productsSlice';
import Link from 'next/link';
import { Plus, Search, Filter, Trash2, Edit, ShoppingBag, X } from 'lucide-react';

export default function ProductsList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleForm, setSaleForm] = useState({ quantity: 1, unitPrice: 0, date: '' });

  // FIX HYDRATION
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = items.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      dispatch(deleteProduct(id));
    }
  };

  const openSaleModal = (product) => {
    setSelectedProduct(product);
    setSaleForm({
      quantity: 1,
      unitPrice: product.price,
      date: new Date().toISOString().split('T')[0]
    });
    setIsSaleModalOpen(true);
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    await dispatch(addSale({
      productId: selectedProduct.id,
      saleData: saleForm
    }));

    setIsSaleModalOpen(false);
    setSelectedProduct(null);
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Liste des Produits</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Ajouter un Produit
        </Link>
      </div>

      {/* Barre d'outils */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="pl-10 pr-8 py-2 border border-slate-200 text-slate-900 rounded-lg bg-white focus:outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes catégories</option>
              <option value="Mobilier">Mobilier</option>
              <option value="Éclairage">Éclairage</option>
              <option value="Textiles">Textiles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Prix</th>
              <th className="px-6 py-4">Quantité</th>
              <th className="px-6 py-4 text-center">Ventes</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-md"></div>
                  {product.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price} €</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">
                  {product.stats?.totalSales || 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${product.quantity > 10 ? 'bg-green-100 text-green-700' :
                      product.quantity > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {product.quantity > 10 ? 'En stock' : product.quantity > 0 ? 'Stock faible' : 'Rupture'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openSaleModal(product)}
                      title="Ajouter une vente"
                      className="p-2 text-slate-400 hover:text-green-600 transition"
                    >
                      <ShoppingBag size={18} />
                    </button>
                    <Link
                      href={`/products/edit/${product.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 transition"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isSaleModalOpen && selectedProduct && isMounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }} className="flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsSaleModalOpen(false)}
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-1">Ajouter une Vente</h2>
            <p className="text-sm text-slate-500 mb-6">Pour <span className="font-semibold text-blue-600">{selectedProduct.name}</span></p>

            <form onSubmit={handleSaleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Quantité</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedProduct.quantity} // Empêcher de vendre plus que le stock
                  className="w-full px-3 py-2 border border-slate-900 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={saleForm.quantity}
                  onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Prix Unitaire (€)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-slate-900 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={saleForm.unitPrice}
                  onChange={(e) => setSaleForm({ ...saleForm, unitPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-slate-900 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={saleForm.date}
                  onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSaleModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Confirmer la vente
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}