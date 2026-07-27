package com.retailpro.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

//Lombok annotation.
//Generates a Builder pattern automatically.
//Allows object creation like:
//
//User user = User.builder()
//              .name("Aadil")
//              .email("aadil@gmail.com")
//              .build();
//
//Makes object creation cleaner when there are many fields.
@Builder

public class Invoice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "invoice_number", nullable = false, unique = true)
	private String invoiceNumber;

	@Column(name = "invoice_date")
	private LocalDateTime invoiceDate;

	@Column(name = "grand_total", nullable = false)
	private BigDecimal grandTotal;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User createdBy;

	@OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true) // orphan means if i delete any items from the list it would be get deleted in the db instead of just unlinking
	@JsonIgnore // Prevents this field from being included in JSON responses, avoid infinite
				// recursion in bidirectional relationships
	private List<InvoiceItem> invoiceItems = new ArrayList<>();

	// JPA Lifecycle Callback.
	//
	// This method executes automatically BEFORE the entity
	// is inserted into the database.
	//
	// Used to initialize default values.
	//
	// Here it automatically sets invoiceDate when a new
	// Invoice record is created.

	@PrePersist
	public void prePersist() {
		invoiceDate = LocalDateTime.now();
	}
}