"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, editProduct } from '@/redux/features/productsSlice';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams(); // Récupère l'ID depuis l'URL (ex: /products/edit/1)
  const { id } = params;

  // On récupère la liste pour trouver le bon produit
  const { items, status } = useSelector((state) => state.products);
  const existingProduct = items.find(p => p.id === id);

  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', quantity: '', description: '', status: 'En stock'
  });

  // Si on rafraîchit la page directement sur l'édit, Redux peut être vide.
  // On recharge les produits si besoin.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Dès qu'on a le produit, on remplit le formulaire
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        sku: existingProduct.sku,
        category: existingProduct.category,
        price: existingProduct.price,
        quantity: existingProduct.quantity,
        description: existingProduct.description || '',
        status: existingProduct.status
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      // Id est gardé, SKU est gardé
      id: id 
    };

    // Appel Redux pour modifier
    await dispatch(editProduct({ id, updatedData }));
    
    router.push('/products');
  };

  if (!existingProduct && status === 'succeeded') {
    return <div className="p-8">Produit introuvable.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/products" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-2 text-sm">
            <ArrowLeft size={16} /> Retour à la liste
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Modifier le Produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        
        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Nom du produit</label>
            <input 
                type="text" name="name" required
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name} onChange={handleChange}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantité</label>
                <input 
                    type="number" name="quantity" required
                    className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.quantity} onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix (€)</label>
                <input 
                    type="number" name="price" step="0.01" required
                    className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price} onChange={handleChange}
                />
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
            <select 
                name="category" required
                className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category} onChange={handleChange}
            >
                <option value="Mobilier">Mobilier</option>
                <option value="Électronique">Électronique</option>
                <option value="Jardin">Jardin</option>
                <option value="Textiles">Textiles</option>
                <option value="Éclairage">Éclairage</option>
            </select>
        </div>

        <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
                name="description" rows="4"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description} onChange={handleChange}
            ></textarea>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
            <Link href="/products" className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition">
                Annuler
            </Link>
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-2">
                <Save size={18} />
                Enregistrer
            </button>
        </div>
      </form>
    </div>
  );
}