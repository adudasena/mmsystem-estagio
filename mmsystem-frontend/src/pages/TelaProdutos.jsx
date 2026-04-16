import React, { useState } from 'react';
import api from '../services/api';

const TelaProdutos = () => {
  const [produto, setProduto] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    preco: '',
    quantidadeEstoque: '',
    tamanho: '',
    coresSelecionadas: []
  });

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];
  const listaCores = [
    { nome: 'Vermelho', cor: 'bg-red-600' },
    { nome: 'Amarelo', cor: 'bg-yellow-400' },
    { nome: 'Verde', cor: 'bg-green-600' },
    { nome: 'Branco', cor: 'bg-white border border-gray-300' },
    { nome: 'Azul', cor: 'bg-blue-600' },
    { nome: 'Preto', cor: 'bg-black' },
    { nome: 'Laranja', cor: 'bg-orange-500' },
    { nome: 'Rosa', cor: 'bg-pink-400' },
    { nome: 'Roxo', cor: 'bg-purple-600' },
  ];

  const aoMudarValor = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleCheckboxCor = (nomeCor) => {
    const jaSelecionada = produto.coresSelecionadas.includes(nomeCor);
    if (jaSelecionada) {
      setProduto({
        ...produto,
        coresSelecionadas: produto.coresSelecionadas.filter(c => c !== nomeCor)
      });
    } else {
      setProduto({
        ...produto,
        coresSelecionadas: [...produto.coresSelecionadas, nomeCor]
      });
    }
  };

  const salvarProduto = async () => {
    try {
      await api.post('/produtos', produto);
      alert('Produto salvo com sucesso na base da Maria Morena!');
      setProduto({ nome: '', categoria: '', descricao: '', preco: '', quantidadeEstoque: '', tamanho: '', coresSelecionadas: [] });
    } catch (erro) {
      console.error("Erro ao salvar", erro);
      alert('Ops! Erro ao conectar com o Java.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 italic">Novo/Editar produto</h2>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Coluna Esquerda */}
        <div className="col-span-7 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-2 text-gray-700">Nome do produto</label>
            <input 
              name="nome"
              value={produto.nome}
              onChange={aoMudarValor}
              type="text" 
              className="w-full border p-2 rounded bg-[#f9f9f7] focus:outline-[#4a5d33]" 
              placeholder="Ex: Vestido Midi Floral" 
            />
            
            <label className="block font-bold mt-4 mb-2 text-gray-700">Categoria</label>
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

            <label className="block font-bold mt-4 mb-2 text-gray-700">Descrição curta</label>
            <textarea 
              name="descricao"
              value={produto.descricao}
              onChange={aoMudarValor}
              className="w-full border p-2 rounded bg-[#f9f9f7] h-32 focus:outline-[#4a5d33]"
              placeholder="Detalhes sobre o produto..."
            ></textarea>
          </section>

          {/* GALERIA DE FOTOS - Corrigida sem o .map que dava erro */}
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4 text-gray-700">Fotos do produto</label>
            <div className="grid grid-cols-4 gap-4">
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a5d33] transition-all">
                <span className="text-2xl">📸</span>
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Adicionar</span>
                <input type="file" multiple className="hidden" />
              </label>

              {/* Quadradinhos manuais para não dar erro de sintaxe */}
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300">
                <span className="text-xs italic">Sem imagem</span>
              </div>
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300">
                <span className="text-xs italic">Sem imagem</span>
              </div>
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300">
                <span className="text-xs italic">Sem imagem</span>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna Direita */}
        <div className="col-span-5 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 text-gray-700">Preço</label>
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
                <label className="block font-bold mb-2 text-gray-700">Estoque</label>
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
            <label className="block font-bold mb-4 text-gray-700">Tamanhos Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {tamanhos.map(t => (
                <button 
                  key={t}
                  type="button"
                  onClick={() => setProduto({...produto, tamanho: t})}
                  className={`border-2 px-3 py-1 font-bold transition-all text-sm ${
                    produto.tamanho === t ? 'bg-black text-white border-black' : 'border-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4 text-gray-700">Cores Disponíveis</label>
            <div className="grid grid-cols-2 gap-y-3">
              {listaCores.map(c => (
                <label key={c.nome} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-[#4a5d33]" 
                    checked={produto.coresSelecionadas.includes(c.nome)}
                    onChange={() => handleCheckboxCor(c.nome)}
                  />
                  <span className={`w-5 h-5 rounded-full ${c.cor} shadow-sm border border-gray-200`}></span>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-black">{c.nome}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 pb-10">
        <button className="bg-black text-white px-10 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all">
          Cancelar
        </button>
        <button 
          onClick={salvarProduto}
          className="bg-[#4a5d33] text-white px-10 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-[#3a4d23] shadow-lg transition-all"
        >
          Salvar Produto
        </button>
      </div>
    </div>
  );
};

export default TelaProdutos;