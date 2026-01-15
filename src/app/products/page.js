"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '@/redux/features/productsSlice';
import Link from 'next/link';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';

export default function ProductsList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  // États locaux pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Logique de filtrage
  const filteredProducts = items.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if(confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div>
      {/* En-tête avec bouton Ajouter */}
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

      {/* Barre d'outils (Recherche & Filtres) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none"
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

      {/* Tableau des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Prix</th>
              <th className="px-6 py-4">Quantité</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    {/* Placeholder image carré */}
                    <div className="w-10 h-10 bg-slate-200 rounded-md"></div>
                    {product.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price} €</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${product.quantity > 10 ? 'bg-green-100 text-green-700' : 
                      product.quantity > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {product.quantity > 10 ? 'En stock' : product.quantity > 0 ? 'Stock faible' : 'Rupture'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition">
                        <Edit size={18} />
                    </button>
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
        
        {/* Message si aucun résultat */}
        {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-slate-500">
                Aucun produit trouvé pour cette recherche.
            </div>
        )}
      </div>
    </div>
  );
}