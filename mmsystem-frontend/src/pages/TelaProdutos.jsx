import React, { useState } from 'react';
import api from '../services/api';

const TelaProdutos = () => {
  // Estado para os campos do formulário (Exatamente como no seu Java)
  const [produto, setProduto] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    preco: '',
    quantidadeEstoque: '',
    tamanho: '',
    cor: ''
  });

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];

  const aoMudarValor = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const salvarProduto = async () => {
    try {
      await api.post('/produtos', produto);
      alert('Produto salvo com sucesso na base da Maria Morena!');
      // Limpar formulário após salvar
      setProduto({ nome: '', categoria: '', descricao: '', preco: '', quantidadeEstoque: '', tamanho: '', cor: '' });
    } catch (erro) {
      console.error("Erro ao salvar", erro);
      alert('Ops! Erro ao conectar com o Java.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 italic">Novo/Editar produto</h2>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Bloco da Esquerda */}
        <div className="col-span-7 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-2">Nome do produto</label>
            <input 
              name="nome"
              value={produto.nome}
              onChange={aoMudarValor}
              type="text" 
              className="w-full border p-2 rounded bg-[#f9f9f7] focus:outline-[#4a5d33]" 
              placeholder="Ex: Blusa Canelada Liz" 
            />
            
            <label className="block font-bold mt-4 mb-2">Categoria</label>
            <select 
              name="categoria"
              value={produto.categoria}
              onChange={aoMudarValor}
              className="w-full border p-2 rounded bg-[#f9f9f7]"
            >
              <option value="">Selecione...</option>
              <option value="Blusas">Blusas</option>
              <option value="Calças">Calças</option>
              <option value="Vestidos">Vestidos</option>
            </select>

            <label className="block font-bold mt-4 mb-2">Descrição curta</label>
            <textarea 
              name="descricao"
              value={produto.descricao}
              onChange={aoMudarValor}
              className="w-full border p-2 rounded bg-[#f9f9f7] h-32 focus:outline-[#4a5d33]"
              placeholder="Detalhes sobre o tecido e caimento..."
            ></textarea>
          </section>
        </div>

        {/* Bloco da Direita */}
        <div className="col-span-5 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2">Preço</label>
                <input 
                  name="preco"
                  value={produto.preco}
                  onChange={aoMudarValor}
                  type="number" 
                  className="w-full border p-2 rounded bg-[#f9f9f7]" 
                  placeholder="R$" 
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Total em Estoque</label>
                <input 
                  name="quantidadeEstoque"
                  value={produto.quantidadeEstoque}
                  onChange={aoMudarValor}
                  type="number" 
                  className="w-full border p-2 rounded bg-[#f9f9f7]" 
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4">Tamanhos Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {tamanhos.map(t => (
                <button 
                  key={t}
                  onClick={() => setProduto({...produto, tamanho: t})}
                  className={`border-2 px-3 py-1 font-bold transition-all ${
                    produto.tamanho === t ? 'bg-black text-white border-black' : 'border-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-2">Cor Principal</label>
            <input 
              name="cor"
              value={produto.cor}
              onChange={aoMudarValor}
              type="text" 
              className="w-full border p-2 rounded bg-[#f9f9f7]" 
              placeholder="Ex: Verde Musgo" 
            />
          </section>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-10 flex justify-end gap-4 pb-10">
        <button className="bg-black text-white px-10 py-2 rounded font-bold uppercase text-sm hover:bg-gray-800">
          Cancelar
        </button>
        <button 
          onClick={salvarProduto}
          className="bg-[#4a5d33] text-white px-10 py-2 rounded font-bold uppercase text-sm hover:bg-[#3a4d23] shadow-lg"
        >
          Salvar Produto
        </button>
      </div>
    </div>
  );
};

export default TelaProdutos;