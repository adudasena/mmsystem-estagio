import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuLateral from './components/MenuLateral';

// Componente temporário para o Painel
const PainelGeral = () => <h2 className="text-2xl font-bold text-gray-800">Bem-vinda, Proprietária! 👋</h2>;

// Tela de produtos
const TelaProdutos = () => (
  <div>
    <header className="mb-8">
      <h2 className="text-3xl font-semibold text-gray-800 italic">Novo/Editar produto</h2>
    </header>
    {/* Aqui vai o código do formulário */}
    <div className="bg-white p-8 rounded shadow-lg border-t-8 border-[#4a5d33]">
       <p className="text-gray-500 italic">Formulário de cadastro carregado com sucesso...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#dcded0]">
        <MenuLateral />
        
        {/* Conteúdo Principal */}
        <main className="flex-1 ml-72 p-12">
          <Routes>
            <Route path="/" element={<PainelGeral />} />
            <Route path="/produtos" element={<TelaProdutos />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;