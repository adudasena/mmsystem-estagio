import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TelaProdutos = () => {
  const [editandoId, setEditandoId] = useState(null); // Estado para saber se estamos editando
  const [produto, setProduto] = useState({
    nome: '', categoria: '', descricao: '', preco: '',
    tamanhosSelecionados: [], coresSelecionadas: [], estoqueDetalhado: {},
    foto: null // Campo para o arquivo da foto
  });

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];
  const listaCores = [
    { nome: 'Vermelho', cor: 'bg-red-600' }, { nome: 'Amarelo', cor: 'bg-yellow-400' },
    { nome: 'Verde', cor: 'bg-green-600' }, { nome: 'Branco', cor: 'bg-white border border-gray-300' },
    { nome: 'Azul', cor: 'bg-blue-600' }, { nome: 'Preto', cor: 'bg-black' },
    { nome: 'Laranja', cor: 'bg-orange-500' }, { nome: 'Rosa', cor: 'bg-pink-400' },
    { nome: 'Roxo', cor: 'bg-purple-600' },
  ];

  const aoMudarValor = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  // --- LÓGICA DE FOTO ---
  const handleFoto = (e) => {
    if (e.target.files && e.target.files) {
      setProduto({ ...produto, foto: e.target.files });
      alert("Foto selecionada com sucesso!");
    }
  };

  // --- LÓGICA DE EDIÇÃO (O QUE ESTAVA FALTANDO) ---
  const prepararEdicao = (item) => {
    setEditandoId(item.id);
    setProduto({
      nome: item.nome,
      categoria: item.categoria,
      descricao: item.descricao,
      preco: item.preco,
      tamanhosSelecionados: item.tamanhosSelecionados || [],
      coresSelecionadas: item.coresSelecionadas || [],
      estoqueDetalhado: item.estoqueDetalhado || {}
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela para editar
  };

  const toggleTamanho = (t) => {
    const novos = produto.tamanhosSelecionados.includes(t)
      ? produto.tamanhosSelecionados.filter(item => item !== t)
      : [...produto.tamanhosSelecionados, t];
    setProduto({ ...produto, tamanhosSelecionados: novos });
  };

  const handleCheckboxCor = (nomeCor) => {
    const novasCores = produto.coresSelecionadas.includes(nomeCor)
      ? produto.coresSelecionadas.filter(c => c !== nomeCor)
      : [...produto.coresSelecionadas, nomeCor];
    setProduto({ ...produto, coresSelecionadas: novasCores });
  };

  const abrirGestaoEstoque = () => {
    if (produto.coresSelecionadas.length === 0 || produto.tamanhosSelecionados.length === 0) {
      alert("Selecione as cores e tamanhos primeiro!");
      return;
    }
    let novoEstoque = { ...produto.estoqueDetalhado };
    produto.coresSelecionadas.forEach(cor => {
      produto.tamanhosSelecionados.forEach(tam => {
        const chave = `${cor}-${tam}`;
        const qtd = prompt(`Quantidade para ${cor} tamanho ${tam}:`, novoEstoque[chave] || 0);
        if (qtd !== null) novoEstoque[chave] = parseInt(qtd) || 0;
      });
    });
    setProduto({ ...produto, estoqueDetalhado: novoEstoque });
  };

  const salvarProduto = async () => {
    try {
      // Se tiver foto, o ideal é usar FormData para enviar o arquivo ao Java
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, produto);
        alert('Produto atualizado na Maria Morena!');
      } else {
        await api.post('/produtos', produto);
        alert('Produto salvo com sucesso!');
      }
      resetarForm();
      buscarProdutos();
    } catch (erro) { alert('Erro ao processar produto.'); }
  };

  const [listaProdutos, setListaProdutos] = useState([]);
  const buscarProdutos = async () => {
    try {
      const resposta = await api.get('/produtos');
      setListaProdutos(resposta.data);
    } catch (erro) { console.error(erro); }
  };

  useEffect(() => { buscarProdutos(); }, []);

  const excluirProduto = async (id) => {
    if(window.confirm("Deseja excluir da base da Maria Morena?")) {
      await api.delete(`/produtos/${id}`);
      buscarProdutos(); 
    }
  };

  const resetarForm = () => {
    setEditandoId(null);
    setProduto({ nome:'', categoria:'', descricao:'', preco:'', tamanhosSelecionados:[], coresSelecionadas:[], estoqueDetalhado:{}, foto: null });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 italic">
          {editandoId ? 'Editando produto' : 'Novo/Editar produto'}
        </h2>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-2 text-gray-700">Nome do produto</label>
            <input name="nome" value={produto.nome} onChange={aoMudarValor} className="w-full border p-2 rounded bg-[#f9f9f7] focus:outline-[#4a5d33]" />
            
            <label className="block font-bold mt-4 mb-2 text-gray-700">Categoria</label>
            <select name="categoria" value={produto.categoria} onChange={aoMudarValor} className="w-full border p-2 rounded bg-[#f9f9f7]">
              <option value="">Selecione...</option>
              <option value="Blusas">Blusas</option>
              <option value="Vestidos">Vestidos</option>
            </select>

            <label className="block font-bold mt-4 mb-2 text-gray-700">Descrição curta</label>
            <textarea name="descricao" value={produto.descricao} onChange={aoMudarValor} className="w-full border p-2 rounded bg-[#f9f9f7] h-32 focus:outline-[#4a5d33]" />
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4 text-gray-700">Fotos do produto</label>
            <div className="grid grid-cols-4 gap-4">
              <label className="border-2 border-dashed border-gray-300 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[#4a5d33] transition-all relative overflow-hidden">
                {produto.foto ? <span className="text-[10px] text-green-600 font-bold text-center px-1">{produto.foto.name}</span> : (
                  <>
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Adicionar</span>
                  </>
                )}
                <input type="file" onChange={handleFoto} className="hidden" />
              </label>
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300 text-xs italic">Sem imagem</div>
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300 text-xs italic">Sem imagem</div>
              <div className="bg-gray-50 border rounded-lg h-28 flex items-center justify-center text-gray-300 text-xs italic">Sem imagem</div>
            </div>
          </section>
        </div>

        <div className="col-span-5 space-y-6">
          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 text-gray-700">Preço</label>
                <input name="preco" value={produto.preco} onChange={aoMudarValor} type="number" className="w-full border p-2 rounded bg-[#f9f9f7]" />
              </div>
              <div onClick={abrirGestaoEstoque} className="cursor-pointer">
                <label className="block font-bold mb-2 text-gray-700">Estoque ⚙️</label>
                <input readOnly value={Object.values(produto.estoqueDetalhado).reduce((a, b) => a + b, 0)} className="w-full border p-2 rounded bg-gray-100 cursor-pointer font-bold text-center" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4 text-gray-700">Tamanhos Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {tamanhos.map(t => (
                <button key={t} type="button" onClick={() => toggleTamanho(t)} className={`border-2 px-3 py-1 font-bold transition-all text-sm ${produto.tamanhosSelecionados.includes(t) ? 'bg-black text-white border-black' : 'border-gray-800'}`}>
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow-md border-b-4 border-gray-300">
            <label className="block font-bold mb-4 text-gray-700">Cores Disponíveis</label>
            <div className="grid grid-cols-2 gap-y-3">
              {listaCores.map(c => (
                <label key={c.nome} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#4a5d33]" checked={produto.coresSelecionadas.includes(c.nome)} onChange={() => handleCheckboxCor(c.nome)} />
                  <span className={`w-5 h-5 rounded-full ${c.cor} border`}></span>
                  <span className="text-xs font-semibold">{c.nome}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 pb-10">
        <button onClick={resetarForm} className="bg-black text-white px-10 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all">Cancelar</button>
        <button onClick={salvarProduto} className="bg-[#4a5d33] text-white px-10 py-2 rounded font-bold uppercase text-xs tracking-widest shadow-lg">
          {editandoId ? 'Atualizar Produto' : 'Salvar Produto'}
        </button>
      </div>

      <section className="mt-12 bg-white p-6 rounded shadow-md border-t-4 border-[#4a5d33] mb-20">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Produtos Cadastrados</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
              <th className="pb-3 px-2">Produto</th>
              <th className="pb-3 px-2">Preço</th>
              <th className="pb-3 px-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {listaProdutos.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-4 px-2 font-semibold text-gray-700">{item.nome}</td>
                <td className="py-4 px-2 text-gray-700">R$ {item.preco}</td>
                <td className="py-4 px-2 text-right space-x-3">
                  <button onClick={() => prepararEdicao(item)} className="text-blue-600 font-bold hover:underline">Editar</button>
                  <button onClick={() => excluirProduto(item.id)} className="text-red-500 font-bold hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TelaProdutos;