CREATE DATABASE josylinhas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE josylinhas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('SuperAdmin', 'Admin', 'Usuário') NOT NULL DEFAULT 'Usuário',
    status ENUM('Ativo', 'Bloqueado') NOT NULL DEFAULT 'Ativo',
    bloqueado_em TIMESTAMP NULL,
    bloqueado_por INT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (bloqueado_por)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);

CREATE TABLE artigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    resumo TEXT NOT NULL,
    conteudo LONGTEXT NOT NULL,
    categorias VARCHAR(255) DEFAULT NULL,
    imagem_url VARCHAR(255) DEFAULT NULL,
    status ENUM('Arquivado', 'Rascunho', 'Publicado') NOT NULL DEFAULT 'Rascunho',
    publicado_em DATETIME DEFAULT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (autor_id)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
);

CREATE TABLE newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expira_em DATETIME NOT NULL,
    usado_em DATETIME NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);