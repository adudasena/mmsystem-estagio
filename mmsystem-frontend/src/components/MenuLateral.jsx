import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuLateral = () => {
  const location = useLocation();

  const menus = [
    { nome: 'Painel', rota: '/', icone: '📊' },
    { nome: 'Produtos', rota: '/produtos', icone: '👗' }, 
    { nome: 'Condicionais', rota: '/condicionais', icone: '📦' },
    { nome: 'Vendas', rota: '/vendas', icone: '🛒' },
    { nome: 'Clientes', rota: '/clientes', icone: '👤' },
  ];

  return (
    <div className="w-72 h-screen bg-[#4a5d33] text-white flex flex-col p-6 fixed left-0 top-0 shadow-xl">
      <div className="mb-12">
        <h1 className="text-2xl font-serif font-bold leading-tight">MARIA MORENA</h1>
        <p className="text-[10px] tracking-[0.2em] opacity-80 uppercase">A moda ao seu alcance</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menus.map((item) => (
          <Link
            key={item.nome}
            to={item.rota}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              location.pathname === item.rota 
                ? 'bg-white/20 border-l-4 border-white shadow-md' 
                : 'hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{item.icone}</span>
            <span className="font-medium">{item.nome}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/20 pt-4">
        <p className="text-xs opacity-60 italic text-center">A moda ao seu alcance.</p>
      </div>
    </div>
  );
};

export default MenuLateral;