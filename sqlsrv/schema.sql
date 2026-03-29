-- Users
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    points INT DEFAULT 0
);

-- Admin
CREATE TABLE admin (
    admin_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Categories
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Recipes
CREATE TABLE recipes (
    recipe_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    category_id INT,
    title VARCHAR(255),
    descriptions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Ratings
CREATE TABLE ratings (
    rating_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    recipe_id INT,
    rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    UNIQUE(user_id, recipe_id) -- one rating per user per recipe
);

-- Feedback
CREATE TABLE feedback (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    recipe_id INT,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- Point Log
CREATE TABLE point_log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    points_change INT,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- User Leaderboard
CREATE TABLE user_leaderboard (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    points INT,
    rank INT,
    period_type VARCHAR(50), -- daily, weekly, monthly
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Recipe Leaderboard
CREATE TABLE recipe_leaderboard (
    id INT IDENTITY(1,1) PRIMARY KEY,
    recipe_id INT,
    average_rating DECIMAL(3,2),
    rank INT,
    period_type VARCHAR(50),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);
