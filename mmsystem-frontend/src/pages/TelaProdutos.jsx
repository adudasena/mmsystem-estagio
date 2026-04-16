import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TelaProdutos = () => {
  const [editandoId, setEditandoId] = useState(null);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [produto, setProduto] = useState({
    nome: '', categoria: '', descricao: '', preco: '',
    tamanhosSelecionados: [], coresSelecionadas: [], estoqueDetalhado: {},
    fotos: [] 
  });

  const tamanhos = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];
  const categorias = ['Blusas', 'Vestidos', 'Saias', 'Camisas', 'Calças', 'Shorts'];
  const listaCores = [
    { nome: 'Vermelho', hex: '#e11d48' }, { nome: 'Amarelo', hex: '#facc15' },
    { nome: 'Laranja', hex: '#ea580c' }, { nome: 'Verde', hex: '#16a34a' }, 
    { nome: 'Branco', hex: '#ffffff' }, { nome: 'Rosa', hex: '#f472b6' },
    { nome: 'Azul', hex: '#2563eb' }, { nome: 'Preto', hex: '#000000' }, 
    { nome: 'Roxo', hex: '#9333ea' },
  ];

  const buscarProdutos = async () => {
    try {
      const resposta = await api.get('/produtos');
      setListaProdutos(resposta.data);
    } catch (erro) { console.error("Erro ao buscar:", erro); }
  };

  useEffect(() => { buscarProdutos(); }, []);

  const handleFotos = (e) => {
    const arquivos = Array.from(e.target.files);
    arquivos.forEach(arquivo => {
      const reader = new FileReader();
      reader.readAsDataURL(arquivo);
      reader.onloadend = () => {
        setProduto(prev => ({
          ...prev,
          fotos: [...prev.fotos, reader.result].slice(0, 4)
        }));
      };
    });
  };

  const prepararEdicao = (p) => {
  setEditandoId(p.id);

  // Função para converter o que vem do banco (String) de volta para Array/Objeto
  const parseSeguro = (dado, tipo) => {
    try {
      return dado ? JSON.parse(dado) : tipo;
    } catch (e) {
      return tipo;
    }
  };

  setProduto({
    nome: p.nome || '',
    categoria: p.categoria || '',
    descricao: p.descricao || '',
    preco: p.preco || '',
    tamanhosSelecionados: parseSeguro(p.tamanhosSelecionados, []),
    coresSelecionadas: parseSeguro(p.coresSelecionadas, []),
    estoqueDetalhado: parseSeguro(p.estoqueDetalhado, {}),
    fotos: parseSeguro(p.fotos, [])
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const abrirGestaoEstoque = () => {
    if (produto.coresSelecionadas.length === 0 || produto.tamanhosSelecionados.length === 0) {
      alert("Selecione as cores e tamanhos primeiro!");
      return;
    }
    alert("MM System: Abrindo lançador de estoque por variação...");
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
  if (!produto.nome || !produto.preco) return alert("Preencha o nome e o preço!");

  try {
    // Envia o objeto 'produto' que já contém os arrays/objetos
    // O Java DTO vai receber isso e o Controller vai converter para String
    if (editandoId) {
      await api.put(`/produtos/${editandoId}`, produto);
    } else {
      await api.post('/produtos', produto);
    }

    alert('Produto salvo com sucesso!');
    resetarForm();
    buscarProdutos(); // Recarrega a lista
  } catch (erro) {
    console.error("Erro detalhado:", erro.response?.data || erro.message);
    alert('Erro ao salvar!');
  }
};

const deletarProduto = async (id) => {
  // A mensagem de confirmação de exclusão
  const certeza = window.confirm("⚠️ MM System: Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.");
  
  if (certeza) {
    try {
      await api.delete(`/produtos/${id}`);
      alert("Produto removido com sucesso!");
      buscarProdutos(); // Atualiza a lista automaticamente
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      alert("Erro ao excluir o produto. Verifique o console.");
    }
  }
};

  const resetarForm = () => {
    setEditandoId(null);
    setProduto({ nome:'', categoria:'', descricao:'', preco:'', tamanhosSelecionados:[], coresSelecionadas:[], estoqueDetalhado:{}, fotos: [] });
  };

const verDetalhes = (p) => {
  const parseJSON = (dado) => {
    try { return typeof dado === 'string' ? JSON.parse(dado) : dado; }
    catch { return {}; }
  };

  const estoque = parseJSON(p.estoqueDetalhado);
  const cores = parseJSON(p.coresSelecionadas);
  const tamanhos = parseJSON(p.tamanhosSelecionados);

  // String de detalhes formatada para exibir as informações do produto
  const mensagem = `
    ✨ PRODUTO: ${p.nome.toUpperCase()} ✨
    ---------------------------------
    📂 Categoria: ${p.categoria}
    💰 Preço: R$ ${p.preco}
    🎨 Cores: ${Array.isArray(cores) ? cores.join(', ') : 'Padrão'}
    📏 Tamanhos: ${Array.isArray(tamanhos) ? tamanhos.join(', ') : 'Único'}
    
    📦 ESTOQUE DETALHADO:
    ${Object.entries(estoque).map(([k, v]) => `   • ${k}: ${v} unidades`).join('\n')}
    ---------------------------------
    ID do Registro: ${p.id}
  `;

  alert(mensagem);
};

  return (
    <div className="flex-1 p-10 bg-[#d9d9ce] min-h-screen font-sans text-gray-800">
      <header className="mb-6">
        <h2 className="text-3xl font-serif italic text-gray-700">
          {editandoId ? 'Editando Produto' : 'Novo/Editar Produto'}
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* INFORMAÇÕES BÁSICAS */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <label className="block text-[11px] font-bold uppercase mb-2 text-gray-500">Nome do produto</label>
            <input value={produto.nome} onChange={e => setProduto({...produto, nome: e.target.value})} className="w-full border p-2 bg-gray-50 outline-none" />
            
            <label className="block text-[11px] font-bold uppercase mt-4 mb-2 text-gray-500">Categoria</label>
            <select value={produto.categoria} onChange={e => setProduto({...produto, categoria: e.target.value})} className="w-full border p-2 bg-gray-50 outline-none">
              <option value="">Selecione...</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <label className="block text-[11px] font-bold uppercase mt-4 mb-2 text-gray-500">Descrição curta</label>
            <textarea value={produto.descricao} onChange={e => setProduto({...produto, descricao: e.target.value})} className="w-full border p-2 h-32 bg-gray-50 outline-none resize-none" />
          </div>

          {/* FOTOS */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <label className="block text-[11px] font-bold uppercase mb-4 text-gray-500">Fotos do produto</label>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <label className="min-w-[100px] h-[100px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded">
                <span className="text-xl">📸</span>
                <span className="text-[8px] font-bold uppercase">ADICIONAR</span>
                <input type="file" multiple onChange={handleFotos} className="hidden" />
              </label>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="min-w-[100px] h-[100px] border bg-gray-50 rounded flex items-center justify-center relative overflow-hidden">
                  {produto.fotos[i] ? (
                    <img src={produto.fotos[i]} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <span className="text-[9px] italic text-gray-300 font-serif">MM System</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* PREÇO E ESTOQUE */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase mb-2 text-gray-500">Preço</label>
              <input value={produto.preco} onChange={e => setProduto({...produto, preco: e.target.value})} placeholder="R$" className="w-full border p-2 bg-gray-50 outline-none" />
            </div>
            <div onClick={abrirGestaoEstoque} className="cursor-pointer">
              <label className="block text-[11px] font-bold uppercase mb-2 text-gray-500">Estoque ⚙️</label>
              <div className="w-full border p-2 bg-gray-100 font-bold text-center text-[#4a5d33]">
                {Object.values(produto.estoqueDetalhado).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          </div>

          {/* TAMANHOS */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <label className="block text-[11px] font-bold uppercase mb-4 text-center text-gray-500">Tamanhos Disponíveis</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {tamanhos.map(t => (
                <button key={t} onClick={() => {
                  const novos = produto.tamanhosSelecionados.includes(t) ? produto.tamanhosSelecionados.filter(x => x !== t) : [...produto.tamanhosSelecionados, t];
                  setProduto({...produto, tamanhosSelecionados: novos});
                }} className={`w-9 h-9 text-[10px] font-bold border transition-all ${produto.tamanhosSelecionados.includes(t) ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* CORES */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <label className="block text-[11px] font-bold uppercase mb-4 text-gray-500">Cores Disponíveis</label>
            <div className="grid grid-cols-2 gap-y-3">
              {listaCores.map(c => (
                <label key={c.nome} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3 accent-[#4a5d33]" checked={produto.coresSelecionadas.includes(c.nome)} onChange={() => {
                     const novos = produto.coresSelecionadas.includes(c.nome) ? produto.coresSelecionadas.filter(x => x !== c.nome) : [...produto.coresSelecionadas, c.nome];
                     setProduto({...produto, coresSelecionadas: novos});
                  }}/>
                  <div className="w-3 h-3 rounded-full border shadow-sm" style={{backgroundColor: c.hex}}></div>
                  <span className="text-[10px] text-gray-600 font-semibold">{c.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-12">
        <button onClick={resetarForm} className="px-10 py-2 bg-black text-white text-[11px] font-bold uppercase rounded-sm hover:opacity-80">Cancelar</button>
        <button onClick={salvarProduto} className="px-12 py-2 bg-[#4a5d33] text-white text-[11px] font-bold uppercase rounded-sm shadow-md hover:brightness-110">
          {editandoId ? 'Atualizar Produto' : 'Salvar Produto'}
        </button>
      </div>

      {/* GESTÃO DE ITENS */}
<section className="bg-white rounded-sm shadow-sm overflow-hidden border-t-4 border-[#4a5d33]">
  <div className="p-4 bg-gray-50 border-b">
    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Produtos Cadastrados</h3>
  </div>
  <table className="w-full text-left">
    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 border-b">
      <tr>
        <th className="p-4">Foto</th>
        <th className="p-4">Produto</th>
        <th className="p-4">Preço</th>
        <th className="p-4">Estoque Total</th>
        <th className="p-4 text-right">Ações</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 text-sm">
      {listaProdutos.map(p => (
        <tr key={p.id} className="hover:bg-gray-50/50">
          {/* CÉLULA DA FOTO */}
          <td className="p-4">
            {(() => {
              try {
                const fotosData = typeof p.fotos === 'string' ? JSON.parse(p.fotos) : p.fotos;
                const fotoExibir = Array.isArray(fotosData) ? fotosData : fotosData;
                const finalSrc = fotoExibir || 'https://via.placeholder.com/40';
                return <img src={finalSrc} className="w-10 h-10 object-cover rounded border" alt="prod" />;
              } catch (e) {
                return <img src={p.fotos || 'https://via.placeholder.com/40'} className="w-10 h-10 object-cover rounded border" alt="prod" />;
              }
            })()}
          </td>

          {/* NOME DO PRODUTO */}
          <td className="p-4 font-bold text-gray-800">{p.nome}</td>

          {/* PREÇO FORMATADO */}
          <td className="p-4 text-gray-600 font-medium">
            R$ {Number(p.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </td>

          {/* ESTOQUE TOTAL (Foco: Retirar o 0 e mostrar total) */}
          <td className="p-4">
            {(() => {
              try {
                // Converte a string JSON do banco para objeto
                const estoqueObj = typeof p.estoqueDetalhado === 'string' 
                  ? JSON.parse(p.estoqueDetalhado) 
                  : p.estoqueDetalhado;

                // Soma matemática pura (evita o "0" na frente)
                const totalCalculado = Object.values(estoqueObj || {}).reduce((acc, curr) => {
                  return acc + Number(curr || 0);
                }, 0);

                return (
                  <div className="flex flex-col">
                    <span className="font-bold text-[#4a5d33]">
                      total: {totalCalculado} un
                    </span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                      {typeof p.estoqueDetalhado === 'string' ? p.estoqueDetalhado : JSON.stringify(p.estoqueDetalhado)}
                    </span>
                  </div>
                );
              } catch (e) {
                return <span className="text-gray-400">0 un</span>;
              }
            })()}
          </td>

          {/* AÇÕES */}
          <td className="p-4 text-right space-x-3">
  <button 
    onClick={() => prepararEdicao(p)} 
    className="text-blue-600 hover:underline text-xs font-bold"
  >
    EDITAR
  </button>
  
  <button 
    onClick={() => deletarProduto(p.id)} 
    className="text-red-600 hover:underline text-xs font-bold"
  >
    EXCLUIR
  </button>
  
  <button 
    onClick={() => verDetalhes(p)} 
    className="text-green-700 hover:underline text-xs font-bold"
  >
    DETALHES
  </button>
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