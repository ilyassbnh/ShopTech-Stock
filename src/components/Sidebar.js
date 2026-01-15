import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col p-4 z-10">
      {/* Logo / En-tête */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
        </div>
        <div>
            <h1 className="font-bold text-slate-800">Gestion Stock</h1>
            <p className="text-xs text-slate-500">Petites Entreprises</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>
        
        <Link href="/products" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
          <Package size={20} />
          <span className="font-medium">Inventaire</span>
        </Link>

        {/* Liens décoratifs (non fonctionnels pour l'instant) */}
        <div className="flex items-center gap-3 p-3 text-slate-400 cursor-not-allowed">
          <ShoppingCart size={20} />
          <span>Commandes</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-400 cursor-not-allowed">
          <FileText size={20} />
          <span>Rapports</span>
        </div>
        <div className="flex items-center gap-3 p-3 text-slate-400 cursor-not-allowed">
          <Settings size={20} />
          <span>Paramètres</span>
        </div>
      </nav>

      {/* Profil Utilisateur (Bas de page) */}
      <div className="mt-auto border-t pt-4 flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold">
            J
        </div>
        <div>
            <p className="text-sm font-medium text-slate-800">Utilisateur</p>
            <p className="text-xs text-slate-500">Admin</p>
        </div>
      </div>
    </aside>
  );
}