DROP TABLE IF EXISTS comments;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `bio` text DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `bio`, `profile_pic`, `created_at`, `reset_token`, `reset_token_expires`, `is_verified`, `verification_token`) VALUES
(29, 'PlanetX', 'planetx.noreply@gmail.com', '$2b$10$yXYF58C6AxqdTuL9Ej9v8eFDZelUykp0UeJbs1tPsDMRt50j34dcW', 'user', 'I can see into your very soul.', '/src/assets/avatars/mooncat.png', '2026-06-26 14:21:49', NULL, NULL, 1, NULL);

CREATE TABLE `genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `genres` (`id`, `name`) VALUES
(1, 'Action'),
(2, 'Adventure'),
(9, 'Fighting'),
(11, 'Horror'),
(10, 'MMO'),
(14, 'Other'),
(7, 'Puzzle'),
(8, 'Racing'),
(3, 'RPG'),
(5, 'Simulation'),
(6, 'Sports'),
(4, 'Strategy'),
(12, 'Survival'),
(13, 'Webs');

CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `developer` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `genre_id` int(11) DEFAULT NULL,
  `downloads` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `games_ibfk_1`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `games` (`id`, `title`, `description`, `developer`, `publisher`, `release_date`, `platform`, `price`, `created_at`, `user_id`, `file_path`, `image_path`, `genre_id`, `downloads`) VALUES
(11, 'Test Game', 'There is an empty zip file you can safely download. This account does not have the ability to delete games so don\'t even try to get in its useless. I should stop giving myself near death experiences with leaving everything on the last second. I do not have motivation to even live but making a game does sound fun. I am sure its not but seeing the smiles on someone\'s face when they play or look at my creations brings me great joy. thats why i looooove horror games! >:3 I do not use this email or account and I am not planning to. After 5 years it will be deleted. enjoy reading my thoughts and errors.', 'PlanetX', 'PlanetX', '2026-06-26', 'PC', 0.00, '2026-06-26 14:33:42', 29, '/uploads/games/gameFile-1782477222351-35208936.zip', '/uploads/covers/coverImage-1782477222352-144340144.jpg', 11, 0);

CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `font_size` varchar(20) NOT NULL,
  `background_image` varchar(255) DEFAULT NULL,
  `background_color` varchar(20) NOT NULL,
  `font_color` varchar(20) NOT NULL,
  `font_family` varchar(50) NOT NULL,
  `border_color` varchar(20) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `game_file` varchar(255) DEFAULT NULL,
  `slug` varchar(100) NOT NULL UNIQUE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pages_games`
  FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pages_ibfk_1`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `text` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `author` varchar(30) NOT NULL DEFAULT 'UNKNOWN',
  PRIMARY KEY (`id`),
  KEY page_id (page_id),
  KEY user_id (user_id),
  CONSTRAINT `comments_ibfk_1`
  FOREIGN KEY (`page_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `comments` (`id`, `page_id`, `user_id`, `text`, `created_at`, `updated_at`, `author`) VALUES
(13, 11, 29, 'Best game ever if you ask me!', '2026-06-26 14:36:00', '2026-06-26 14:36:00', 'PlanetX'),
(14, 11, 29, 'these comments need some improving... shame\n', '2026-06-26 14:36:47', '2026-06-26 14:36:47', 'PlanetX');


CREATE TABLE `page_genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `page_genres_ibfk_1`
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `page_genres_ibfk_2`
  FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL UNIQUE,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `ratings_ibfk_1`
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `screenshots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `screenshots_ibfk_1`
  FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;