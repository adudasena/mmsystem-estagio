package com.adudasena.mmsystem.service;

import com.adudasena.mmsystem.model.Produto;
import com.adudasena.mmsystem.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Produto salvar (Produto produto) {
        return repository.save(produto);
    }

    public Produto editar (Long id, Produto produtoAtualizado) {
        //busca o produto no banco pelo id
        return repository.findById(id).map(produto -> {
            //só atualiza se o campo foi enviado no JSON
            if (produtoAtualizado.getNome() != null) {
                produto.setNome(produtoAtualizado.getNome());
            }
            if (produtoAtualizado.getDescricao() != null) {
                produto.setDescricao(produtoAtualizado.getDescricao());
            }
            if (produtoAtualizado.getPreco() != null) {
                produto.setPreco(produtoAtualizado.getPreco());
            }
            if (produtoAtualizado.getCategoria() != null) {
                produto.setCategoria(produtoAtualizado.getCategoria());
            }
            if (produtoAtualizado.getCor() != null) {
                produto.setCor(produtoAtualizado.getCor());
            }
            if (produtoAtualizado.getTamanho() != null) {
                produto.setTamanho(produtoAtualizado.getTamanho());
            }
            if (produtoAtualizado.getQuantidadeEstoque() != null) {
                produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());
            }
            if (produtoAtualizado.getStatus() != null) {
                produto.setStatus(produtoAtualizado.getStatus());
            }
            if (produtoAtualizado.getImagemUrl() != null) {
                produto.setImagemUrl(produtoAtualizado.getImagemUrl());
            }
            return repository.save(produto);
        }).orElseThrow(() -> new RuntimeException("Produto não encontrado com o ID: " + id));
    }

    public void excluir(Long id) {
        //validação
        if (!repository.existsById(id)) {
            throw new RuntimeException("Não é possível deletar: Produto não encontrado");
        }
        repository.deleteById(id);
        }
    }

