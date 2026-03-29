-- Users
INSERT INTO users (name, email, password, points) VALUES
('Alice', 'alice@mail.com', 'pass123', 180),
('Bob', 'bob@mail.com', 'pass123', 120),
('Charlie', 'charlie@mail.com', 'pass123', 95),
('David', 'david@mail.com', 'pass123', 60);


-- Admin
INSERT INTO admin (name, email, password) VALUES
('Admin1', 'admin1@mail.com', 'adminpass');


-- Categories
INSERT INTO categories (name) VALUES
('Dessert'),
('Main Course'),
('Vegan'),
('Fast Food'),
('Drinks'),
('Seafood');


-- Recipes
INSERT INTO recipes (user_id, category_id, title, description) VALUES
(1, 1, 'Chocolate Cake', 'Rich chocolate layered cake'),
(2, 2, 'Grilled Chicken', 'Spicy grilled chicken'),
(3, 3, 'Vegan Salad', 'Fresh healthy salad'),
(4, 4, 'Cheese Burger', 'Juicy beef burger'),
(3, 5, 'Mango Smoothie', 'Refreshing mango drink'),
(2, 6, 'Grilled Fish', 'Lemon butter fish');


-- Ratings
INSERT INTO ratings (user_id, recipe_id, rating_value) VALUES
(2, 1, 5),
(4, 1, 5),
(1, 2, 3),
(1, 3, 5),
(2, 3, 4),
(1, 5, 5),
(3, 5, 4),
(4, 6, 4);


-- Feedback
INSERT INTO feedback (user_id, recipe_id, comment) VALUES
(2, 1, 'Absolutely loved it!'),
(3, 1, 'Very tasty'),
(4, 1, 'Perfect texture'),
(1, 2, 'Needs more spice'),
(2, 3, 'Healthy and fresh'),
(1, 3, 'Nice combination'),
(3, 5, 'Loved the smoothie'),
(2, 5, 'Very refreshing'),
(4, 6, 'Fish was perfectly cooked');


-- Point Log
INSERT INTO point_log (user_id, points_change, reason) VALUES
(1, 20, 'Uploaded recipe'),
(1, 10, 'Received high ratings'),
(2, 10, 'Rated recipes'),
(2, 5, 'Feedback given'),
(3, 15, 'Uploaded recipe'),
(3, 5, 'Ratings given'),
(4, 10, 'Uploaded recipe');


-- User Leaderboard
INSERT INTO user_leaderboard (user_id, points, rank, period_type) VALUES
(1, 180, 2, 'weekly'),
(2, 120, 4, 'weekly'),
(3, 95, 5, 'weekly'),
(1, 180, 1, 'monthly'),
(4, 200, 2, 'monthly');


-- Recipe Leaderboard
INSERT INTO recipe_leaderboard (recipe_id, average_rating, rank, period_type) VALUES
(1, 4.67, 1, 'weekly'),
(3, 4.50, 3, 'weekly'),
(6, 4.50, 5, 'weekly'),
(1, 4.67, 1, 'monthly'),
(5, 4.67, 2, 'monthly'),
(3, 4.50, 3, 'monthly');
