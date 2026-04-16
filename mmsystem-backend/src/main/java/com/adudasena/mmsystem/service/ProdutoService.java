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
}
