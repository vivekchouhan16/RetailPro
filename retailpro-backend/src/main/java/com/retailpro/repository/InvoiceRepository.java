package com.retailpro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retailpro.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

}