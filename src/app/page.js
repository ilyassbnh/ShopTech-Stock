"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesData } from '@/redux/features/salesSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingBag, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { salesList, globalStats, status } = useSelector((state) => state.sales);

  // Charger les données au démarrage
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSalesData());
    }
  }, [status, dispatch]);

  // Données formatées pour le graphique (Ventes par catégorie)
  // Note: Dans un vrai projet, on calculerait ça dynamiquement. Ici on simule pour l'affichage.
  const chartData = [
    { name: 'Élec', ventes: 4000 },
    { name: 'Maison', ventes: 3000 },
    { name: 'Jardin', ventes: 5500 }, // La barre bleue du design
    { name: 'Auto', ventes: 2000 },
    { name: 'Sport', ventes: 2780 },
  ];

  if (status === 'loading') return <div className="p-8">Chargement des données...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Tableau de Bord</h1>

      {/* 1. Les 4 Cartes de Stats (Top) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Package />} title="Stock total" value={`${globalStats.totalStock} Unités`} />
        <StatCard icon={<DollarSign />} title="Valeur Stock" value={`${globalStats.totalStockValue} €`} />
        <StatCard icon={<ShoppingBag />} title="Produits vendus" value={`${globalStats.productsSold} Unités`} />
        <StatCard icon={<TrendingUp />} title="Revenus (30j)" value={`${globalStats.totalSalesValue} €`} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Graphique des Ventes (Gauche - prend 2 colonnes) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Performance des Ventes</h3>
            <select className="bg-slate-50 border rounded-md px-3 py-1 text-sm">
              <option>Ce mois</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="ventes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Section Analyse IA (Droite - prend 1 colonne) */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <Sparkles size={20} />
            <h3 className="font-bold">Analyse IA</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Les ventes de la catégorie <strong>'Jardin'</strong> ont augmenté de 25% ce mois-ci, portées par le produit "Tondeuse Pro".
            <br /><br />
            Envisagez une promotion sur les produits complémentaires pour maximiser les revenus.
          </p>
          <button className="mt-4 w-full bg-white text-blue-600 text-sm font-medium py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
            Générer une nouvelle analyse
          </button>
        </div>
      </div>

      {/* 4. Tableau des Dernières Ventes (Bas) */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">Dernières Ventes</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Quantité</th>
              <th className="px-6 py-4">Prix Unitaire</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salesList.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{sale.productName}</td>
                <td className="px-6 py-4">{sale.category}</td>
                <td className="px-6 py-4">{sale.quantity}</td>
                <td className="px-6 py-4">{sale.unitPrice} €</td>
                <td className="px-6 py-4">{sale.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Petit composant pour les cartes du haut
function StatCard({ icon, title, value, highlight }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
        {icon}
      </div>
    </div>
  );
}
