-- --------------------------------------------------------
-- Servidor:                     localhost
-- Versão do servidor:           8.0.23 - MySQL Community Server - GPL
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para gorila
CREATE DATABASE IF NOT EXISTS `gorila` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gorila`;

-- Copiando estrutura para tabela gorila.investments
CREATE TABLE IF NOT EXISTS `investments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('RENDA_VARIAVEL','RENDA_FIXA') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'RENDA_VARIAVEL',
  `value` float NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK` (`user_id`),
  CONSTRAINT `FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Tabela de investimentos';

-- Copiando dados para a tabela gorila.investments: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
INSERT INTO `investments` (`id`, `type`, `value`, `date`, `user_id`) VALUES
	(5, 'RENDA_VARIAVEL', 1200, '2021-02-24', 1),
	(6, 'RENDA_FIXA', 5000, '2021-02-24', 1),
	(7, 'RENDA_VARIAVEL', 500, '2021-02-24', 2),
	(8, 'RENDA_FIXA', 5000, '2020-02-23', 1);
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;

-- Copiando estrutura para tabela gorila.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Tabela de usuários do teste';

-- Copiando dados para a tabela gorila.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `password`) VALUES
	(1, 'pedroschellerg', '123456'),
	(2, 'admin', 'abc123');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
