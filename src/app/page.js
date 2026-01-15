"use client";

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesData } from '@/redux/features/salesSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingBag, Sparkles, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { salesList, globalStats, status } = useSelector((state) => state.sales);

  // État pour l'IA
  const [aiAnalysis, setAiAnalysis] = useState("Cliquez sur le bouton pour générer une analyse basée sur vos données réelles.");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // FIX HYDRATION: État pour vérifier si on est sur le navigateur
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (status === 'idle') {
      dispatch(fetchSalesData());
    }
  }, [status, dispatch]);

  // --- CALCUL DYNAMIQUE DES DONNÉES DU GRAPHIQUE ---
  // On utilise useMemo pour ne recalculer que si salesList change
  const chartData = useMemo(() => {
    // 1. On crée un objet pour accumuler les ventes par catégorie
    const categoriesMap = {};

    salesList.forEach((sale) => {
      // Si la catégorie n'existe pas encore, on l'initialise à 0
      if (!categoriesMap[sale.category]) {
        categoriesMap[sale.category] = 0;
      }
      // On ajoute le montant de la vente (Prix x Quantité)
      // Tu peux changer ici par "sale.quantity" si tu préfères voir le nombre d'unités
      categoriesMap[sale.category] += (sale.unitPrice * sale.quantity);
    });

    // 2. On transforme cet objet en tableau pour le graphique Recharts
    // Ex: { Mobilier: 600, Jardin: 200 } devient [{ name: 'Mobilier', ventes: 600 }, ...]
    return Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      ventes: parseFloat(categoriesMap[catName].toFixed(2)) // On arrondit à 2 décimales
    }));
  }, [salesList]);
  // -----------------------------------------------

  const handleGenerateAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const topSalesData = salesList.slice(0, 3).map(s => ({
        produit: s.productName,
        quantite: s.quantity,
        categorie: s.category
      }));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: globalStats,
          topProducts: topSalesData
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Erreur", error);
      setAiAnalysis("Erreur lors de la génération. Vérifiez votre clé API.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (status === 'loading') return <div className="p-8">Chargement des données...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Tableau de Bord</h1>

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Package />} title="Stock total" value={`${globalStats.totalStock} Unités`} />
        <StatCard icon={<DollarSign />} title="Valeur Stock" value={`${globalStats.totalStockValue} €`} />
        <StatCard icon={<ShoppingBag />} title="Produits vendus" value={`${globalStats.productsSold} Unités`} />
        <StatCard icon={<TrendingUp />} title="Revenus (30j)" value={`${globalStats.totalSalesValue} €`} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Graphique */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Performance des Ventes (en €)</h3>
          </div>
          <div className="h-64">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    formatter={(value) => [`${value} €`, 'Ventes']} // Ajoute le symbole € au survol
                  />
                  <Bar dataKey="ventes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>

        {/* Section Analyse IA */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <Sparkles size={20} />
            <h3 className="font-bold">Analyse IA</h3>
          </div>
          
          <div 
            className="flex-1 text-sm text-slate-700 leading-relaxed mb-4 min-h-[100px]"
            suppressHydrationWarning={true}
          >
            {isAiLoading ? (
              <div className="flex items-center justify-center h-full text-blue-400 gap-2">
                <Loader2 className="animate-spin" /> Analyse en cours...
              </div>
            ) : (
              aiAnalysis
            )}
          </div>

          <button 
            onClick={handleGenerateAnalysis}
            disabled={isAiLoading}
            className="w-full bg-white text-blue-600 text-sm font-medium py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiLoading ? 'Génération...' : 'Générer une nouvelle analyse'}
          </button>
        </div>
      </div>

      {/* Tableau des Dernières Ventes */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">Dernières Ventes</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Quantité</th>
              <th className="px-6 py-4">Prix</th>
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