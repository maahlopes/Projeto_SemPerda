-- CREATE --
INSERT INTO doacao (id_usuario, id_produto, id_ong, quantidade, data_doacao) 
VALUES (1, 1, 1, 15, '2026-11-18');

-- READ --
SELECT doacao.*, usuario.nome AS doador, produto.nome AS produto, ong.nome AS ong_destino
FROM doacao 
INNER JOIN usuario ON doacao.id_usuario = usuario.id_usuario
INNER JOIN produto  ON doacao.id_produto = produto.id_produto
INNER JOIN ong  ON doacao.id_ong = ong.id_ong
WHERE doacao.id_doacao = 1;

-- UPDATE --
UPDATE doacao 
SET quantidade = 20 
WHERE id_doacao = 1;

-- DELETE --
DELETE FROM doacao WHERE id_doacao = 1;
