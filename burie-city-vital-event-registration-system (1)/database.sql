SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS burie_vital_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE burie_vital_events;

-- 1. KEBELLES TABLE
CREATE TABLE IF NOT EXISTS kebeles (
    kebele_id VARCHAR(10) NOT NULL,
    name_am VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    PRIMARY KEY (kebele_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    role ENUM('ADMIN', 'SUPERVISOR', 'DATA_CLERK', 'CITIZEN') NOT NULL,
    kebele_id VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MAIN VITAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS vital_records (
    record_id VARCHAR(50) NOT NULL,
    event_type ENUM('BIRTH', 'DEATH', 'MARRIAGE', 'DIVORCE') NOT NULL,
    kebele_id VARCHAR(10) NOT NULL,
    status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    registration_date DATETIME NOT NULL,
    applicant_id VARCHAR(50) NOT NULL,
    certificate_number VARCHAR(100),
    rejection_reason TEXT CHARACTER SET utf8mb4,
    metadata JSON,
    PRIMARY KEY (record_id),
    UNIQUE KEY (certificate_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(50),
    user_name VARCHAR(255),
    action VARCHAR(100),
    details TEXT,
    INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INITIAL DATA: BURIE CITY KEBELLES
INSERT INTO kebeles (kebele_id, name_am, name_en) VALUES 
('01', 'ቀበሌ 01', 'Kebele 01'),
('02', 'ቀበሌ 02', 'Kebele 02'),
('03', 'ቀበሌ 03', 'Kebele 03'),
('04', 'ቀበሌ 04', 'Kebele 04'),
('05', 'ቀበሌ 05', 'Kebele 05'),
('06', 'ቀበሌ 06', 'Kebele 06'),
('07', 'ቀበሌ 07', 'Kebele 07'),
('08', 'ቀበሌ 08', 'Kebele 08')
ON DUPLICATE KEY UPDATE name_en=VALUES(name_en);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
