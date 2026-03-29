-- Get all recipes with average rating
SELECT r.recipe_id, r.title,
       AVG(rt.rating_value) AS avg_rating
FROM recipes r
LEFT JOIN ratings rt ON r.recipe_id = rt.recipe_id
GROUP BY r.recipe_id;


-- Get recipes uploaded by a user
SELECT * FROM recipes
WHERE user_id = 1;


-- Get top 10 users by points
SELECT name, points
FROM users
ORDER BY points DESC
LIMIT 10;


-- Get feedback for a recipe
SELECT u.name, f.comment
FROM feedback f
JOIN users u ON f.user_id = u.user_id
WHERE f.recipe_id = 1;


-- Generate recipe leaderboard
SELECT recipe_id,
       AVG(rating_value) AS avg_rating,
       RANK() OVER (ORDER BY AVG(rating_value) DESC) AS rank
FROM ratings
GROUP BY recipe_id;


-- Get recipes with category name
SELECT r.title, c.name AS category
FROM recipes r
JOIN categories c ON r.category_id = c.category_id;


-- Get user points history
SELECT u.name, p.points_change, p.reason, p.created_at
FROM point_log p
JOIN users u ON p.user_id = u.user_id
ORDER BY p.created_at DESC;
