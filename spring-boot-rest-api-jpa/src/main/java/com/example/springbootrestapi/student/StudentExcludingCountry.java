package com.example.springbootrestapi.student;

import java.time.LocalDate;

/*
* projection
*/
public interface StudentExcludingCountry {
	Long getId();
	
	String getName();
	
	String getEmail();
	
	LocalDate getDob();
	
	Integer getAge();
}
