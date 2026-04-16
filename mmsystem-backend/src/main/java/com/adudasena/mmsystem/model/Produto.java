package com.adudasena.mmsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    private String categoria;

    // Atributos para as variações
    private String cor;
    private String tamanho;
    private Integer quantidadeEstoque;

    // Status: DISPONIVEL, ESGOTADO, CONDICIONAL
    private String status;

    private String imagemUrl; // Link
}



