package com.retailpro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retailpro.entity.InvoiceItem;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {

}