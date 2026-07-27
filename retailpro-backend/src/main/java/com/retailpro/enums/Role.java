package com.retailpro.enums;

/*
Stores enum values as text in the database.
	Example:
	ADMIN
	STAFF
Better than ORDINAL because database values remain
readable and are not affected if enum order changes.
 */

public enum Role {
	ADMIN, STAFF
}
