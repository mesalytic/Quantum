DELIMITER //
CREATE PROCEDURE `GetLevel`(IN xp INT, OUT level INT)
SET level = FLOOR((-100 + SQRT(10000 + 2 * xp)) / 1)//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `inventory` (
  `userID` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xp` bigint(20) NOT NULL DEFAULT 0,
  `mana` int(10) NOT NULL DEFAULT 20,
  `maxMana` int(11) NOT NULL DEFAULT 20,
  `biome` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mystic_grove',
  `enchanted_crystals` bigint(20) NOT NULL DEFAULT 0,
  `mystic_ores` bigint(20) NOT NULL DEFAULT 0,
  `ethereal_gems` bigint(20) NOT NULL DEFAULT 0,
  `whispering_stones` bigint(20) NOT NULL DEFAULT 0,
  `luminous_shards` bigint(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER update_maxMana
BEFORE UPDATE ON inventory
FOR EACH ROW
BEGIN
  CALL GetLevel(NEW.xp, @level);
  SET NEW.maxMana = 30 + @level;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;
