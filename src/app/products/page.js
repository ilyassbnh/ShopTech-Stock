"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, addSale } from '@/redux/features/productsSlice';
import Link from 'next/link';
import { Plus, Trash2, Edit, ShoppingCart, X, Filter, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductsList() {
    const dispatch = useDispatch();
    const { items: products, status } = useSelector((state) => state.products);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Modal State
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [sellingProduct, setSellingProduct] = useState(null);
    const [sellQuantity, setSellQuantity] = useState(1);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleOpenSellModal = (product) => {
        setSellingProduct(product);
        setSellQuantity(1);
        setIsSellModalOpen(true);
    };

    const handleConfirmSell = async () => {
        if (!sellingProduct) return;

        if (sellQuantity > sellingProduct.quantity) {
            alert("Stock insuffisant !");
            return;
        }

        const saleData = {
            quantity: parseInt(sellQuantity),
            unitPrice: parseFloat(sellingProduct.price),
            date: new Date().toISOString()
        };

        await dispatch(addSale({ productId: sellingProduct.id, saleData }));

        // Close and reset
        setIsSellModalOpen(false);
        setSellingProduct(null);
        setSellQuantity(1);
    };

    // Filtrage
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    if (status === 'loading') return <div className="p-8 text-center text-slate-500">Chargement de l'inventaire...</div>;

    return (
        <div>
            {/* En-tête avec Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Inventaire</h1>
                    <p className="text-slate-500 text-sm">{products.length} produits en stock</p>
                </div>
                <Link
                    href="/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus size={18} /> Ajouter un produit
                </Link>
            </div>

            {/* Barre de Filtres */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full p-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Toutes catégories</option>
                        <option value="Mobilier">Mobilier</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Jardin">Jardin</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Éclairage">Éclairage</option>
                    </select>
                </div>
            </div>

            {/* Tableau des Produits */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Nom</th>
                            <th className="px-6 py-4">Catégorie</th>
                            <th className="px-6 py-4">Prix</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4">{parseFloat(product.price).toFixed(2)} €</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${product.quantity < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenSellModal(product)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition tooltip-trigger"
                                            title="Vendre"
                                            disabled={product.quantity <= 0}
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <Link href={`/products/edit/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Modifier">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                    Aucun produit trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL DE VENTE */}
            {isSellModalOpen && sellingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Enregistrer une Vente</h3>
                            <button onClick={() => setIsSellModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-slate-500 mb-1">Produit</p>
                            <p className="font-bold text-lg text-slate-800">{sellingProduct.name}</p>
                            <p className="text-sm text-green-600 mt-1">Stock disponible: {sellingProduct.quantity}</p>
                        </div>

                        {/* Sélecteur de Quantité Amélioré */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantité vendue</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                                        className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition border-r border-slate-200"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={sellingProduct.quantity}
                                        className="w-20 p-3 text-center font-bold text-lg focus:outline-none appearance-none"
                                        value={sellQuantity}
                                        onChange={(e) => setSellQuantity(Math.max(1, Math.min(sellingProduct.quantity, parseInt(e.target.value) || 0)))}
                                    />
                                    <button
                                        onClick={() => setSellQuantity(Math.min(sellingProduct.quantity, sellQuantity + 1))}
                                        className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition border-l border-slate-200"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-end flex-1">
                                    <span className="text-xs text-slate-500">Total</span>
                                    <span className="font-bold text-xl text-blue-600">
                                        {(sellingProduct.price * sellQuantity).toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsSellModalOpen(false)}
                                className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmSell}
                                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                            >
                                Confirmer Vente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}