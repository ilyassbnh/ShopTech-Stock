"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '@/redux/features/productsSlice';
import { useRouter } from 'next/navigation'; // Pour la redirection
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProduct() {
  const dispatch = useDispatch();
  const router = useRouter();

  // État local du formulaire
  const [formData, setFormData] = useState({
    name: '',
    sku: '', // On le générera ou on le demande, ici je demande simple
    category: '',
    price: '',
    quantity: '',
    description: '',
    status: 'En stock' // Valeur par défaut
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Conversion des types (prix et quantité doivent être des nombres)
    const productToSend = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      // Génération d'un SKU basique si vide
      sku: formData.sku || `SKU-${Math.floor(Math.random() * 10000)}` 
    };

    // 1. Dispatch l'action Redux
    await dispatch(addProduct(productToSend));

    // 2. Rediriger vers la liste des produits
    router.push('/products');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête simple */}
      <div className="mb-6">
        <Link href="/products" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-2 text-sm">
            <ArrowLeft size={16} /> Retour à la liste
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Ajouter un Nouveau Produit</h1>
        <p className="text-slate-500">Remplissez les informations ci-dessous pour ajouter un article.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        
        {/* Nom du produit */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Nom du produit</label>
            <input 
                type="text" 
                name="name"
                required
                placeholder="Ex: Chaise de bureau ergonomique"
                className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
            />
        </div>

        {/* Grille 2 colonnes : Quantité & Prix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantité</label>
                <input 
                    type="number" 
                    name="quantity"
                    required
                    placeholder="Ex: 150"
                    className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"                    value={formData.quantity}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prix (€)</label>
                <input 
                    type="number" 
                    name="price"
                    required
                    step="0.01"
                    placeholder="Ex: 299.99"
className="w-full p-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"                    value={formData.price}
                    onChange={handleChange}
                />
            </div>
        </div>

        {/* Catégorie */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
            <select 
                name="category"
                required
                className="w-full p-3 border border-slate-200 text-slate-700 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
            >
                <option value="">Sélectionner une catégorie</option>
                <option value="Mobilier">Mobilier</option>
                <option value="Électronique">Électronique</option>
                <option value="Jardin">Jardin</option>
                <option value="Textiles">Textiles</option>
                <option value="Éclairage">Éclairage</option>
            </select>
        </div>

        {/* Description */}
        <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
                name="description"
                rows="4"
                placeholder="Décrivez le produit..."
                className="w-full p-3 border border-slate-200 text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={handleChange}
            ></textarea>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 border-t pt-6">
            <Link 
                href="/products"
                className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
            >
                Annuler
            </Link>
            <button 
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition flex items-center gap-2"
            >
                <Save size={18} />
                Ajouter le Produit
            </button>
        </div>

      </form>
    </div>
  );
}