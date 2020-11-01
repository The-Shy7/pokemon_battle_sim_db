-- Name: Tahmin Talukder
-- Section : CSE 154 AQ
-- Date: June 6th, 2019
-- This file creates and accesses the hw5 database within phpMyAdmin
-- and creates a table called Pokedex with columns name, nickname,
-- and datefound.


CREATE DATABASE hw5db;
USE hw5db;

CREATE TABLE Pokedex(
  name VARCHAR(30) PRIMARY KEY not null,
  nickname VARCHAR(30) not null,
  datefound DATETIME not null
);
