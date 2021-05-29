USE master
USE TABD_TP1
GO
SELECT * FROM Utilizador
EXEC Novo_Utilizador 1, 'Ginho', 'a', 'a@a.a', 0
EXEC Novo_Utilizador 2, 'Quim', '1', 'b@a.a', 1
EXEC Novo_Utilizador 3, 'Ginhao', '1', 'c@a.a', 2
EXEC Novo_Utilizador 4, 'RestauranteQuim2', '1', 'd@a.a', 2
EXEC Novo_Utilizador 5, 'Restaurante5', '1', 'e@a.a', 2
EXEC Novo_Utilizador 6, 'Admin2', '1', 'f@a.a', 0
EXEC Novo_Utilizador 7, 'Cliente2', '1', 'g@a.a', 1
EXEC Novo_Utilizador 8, 'Admin3', '1', 'h@a.a', 1
EXEC Novo_Utilizador 9, 'Restaurante6', '1', 'h@a.a', 1

SELECT * FROM Client
EXEC Novo_Cliente 1, 'Ginho', 1
EXEC Novo_Cliente 7, 'Ginho2', 1
EXEC Alterar_Cliente 1, 'Ginho2'

SELECT * FROM Restaurante
EXEC Criar_Restaurante 2, 'Quim', 'Rua dos ginhos', 'gps', '123451523', 'Segunda feira', 1, 1, 1, '09:00', '22:00', 'descricaoGinho', 'foto'
EXEC Criar_Restaurante 4, 'RestauranteQuim2','Rua dos ginhos', 'gps', '123454523', 'Quarta feira', 1, 0, 1, '09:00', '20:00', 'descricaoGinho', 'foto2'
EXEC Alterar_Restaurante 2, 'Quim1', 'Rua dos ginhos', 'gps', '123451523', 'Segunda feira', 1, 1, 1, '09:00', '22:00', 'descricaoGinho', 'foto'
EXEC Criar_Restaurante 5, 'Restaurante5','Rua dos ginhos', 'gps', '123444523', 'Quarta feira', 1, 0, 1, '09:00', '20:00', 'descricaoGinho', 'foto2'
EXEC Criar_Restaurante 9, 'Restaurante9','Rua dos ginhos2', 'gps', '123447523', 'Quarta feira', 1, 0, 1, '09:00', '20:00', 'descricaoGinho', 'foto2'


SELECT * FROM Administrador
EXEC Novo_Admin 3, 'Ginhao'
EXEC Alterar_Admin 'Ginhao', 3
EXEC Novo_Admin 6, 'Ginhao'
EXEC Novo_Admin 8, 'Ginhao'

EXEC Alterar_Utilizador 'Ginho', 'AAAAA', 'k@k.k', 0

SELECT * FROM AdicionarRestFav
EXEC Adicionar_RestauranteFavorito 1, 2, 0
EXEC Adicionar_RestauranteFavorito 7, 2, 0

SELECT * FROM PratoDoDia
EXEC Criar_Prato_Do_Dia 1, 'Carne', 'Carne', 'Carne', 'ginho'
EXEC Criar_Prato_Do_Dia 2, 'Vegan', 'Vegan', 'Vegan', 'foto'
EXEC Criar_Prato_Do_Dia 3, 'Vegan', 'Vegan', 'Vegan', 'foto'

SELECT * FROM CriarPrato
EXEC Criar_Prato 2, 1, 10, 'Segunda feira', 0
EXEC Criar_Prato 4, 2, 69, 'Quarta feira', 0
EXEC Criar_Prato 2, 3, 11, 'Segunda feira', 0

EXEC Alterar_Pratos_Restaurante 2, 1, 'Carne1', 111, 'Segunda feira', 'AAAA', 'Carne'
EXEC Alterar_Pratos_Restaurante 4, 3, 'Carne1', 11, 'Segunda feira', 'Carne', 'Carne'

SELECT * FROM AdicionarPratoFav
EXEC Adicionar_PratoFavorito 1, 1, '2021-04-24'
EXEC Adicionar_PratoFavorito 1, 2, '2021-04-24'
EXEC Adicionar_PratoFavorito 1, 3, '2021-04-24'

EXEC Confirmar_Email 1
EXEC Confirmar_Email 7

SELECT * FROM BloquearUtilizador
EXEC Bloquear_Utilizador 3, 1, 1, 'Por ser um ginhao'
EXEC Bloquear_Utilizador 8, 7, 1, 'Por ser um ginhao'

SELECT * FROM Autorizar
EXEC Autorizar_Restaurante 3, 2
EXEC Autorizar_Restaurante 3, 5 
EXEC Autorizar_Restaurante 3, 4 
EXEC Autorizar_Restaurante 69, 5 
EXEC Autorizar_Restaurante 3, 69 
EXEC Autorizar_Restaurante 3, 9

EXEC Ver_Restaurantes_Autorizados
EXEC Ver_Clientes
EXEC Ver_Clientes_Bloqueados
EXEC Ver_Restaurantes_Nao_Autorizados 
EXEC Ver_Pratos_do_Dia_Restaurante 4
EXEC Ver_Pratos
EXEC Ver_Pratos_do_Dia
EXEC Ver_Horario_Restaurantes
EXEC Ver_Horario_Restaurante_Especifico 2
EXEC Ver_Localizacao_Rest_Especifico 2
EXEC Ver_PratosFav 1
EXEC Ver_RestaurantesFav 1
EXEC Ver_Restaurante_Especifico_Cliente 2
EXEC Eliminar_Pratos_Restaurante 2, 11
EXEC Eliminar_Pratos_Do_Dia_Restaurante 2, 1, 'Segunda feira'
EXEC Ver_Todos_Restaurantes_Cliente
EXEC Ver_Servicos 0, 0, 0
EXEC Ver_Servicos_Rest_Especifico 4
EXEC Ver_Localizacao_Rest 'Rua dos ginhos'
EXEC Ver_Restaurantes_Admin

DELETE FROM Utilizador
WHERE id_Utilizador = 5

EXEC Eliminar_Utilizador 69
EXEC Eliminar_Restaurante 5