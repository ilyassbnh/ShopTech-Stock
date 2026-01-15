import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p>Le contenu du Dashboard s'affichera ici.</p>
      </div>
    </div>
  );
}
