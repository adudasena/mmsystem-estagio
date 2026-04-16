package com.adudasena.mmsystem.repository;

import com.adudasena.mmsystem.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository <Produto, Long> {
    //long é o tipo de id da model
}
