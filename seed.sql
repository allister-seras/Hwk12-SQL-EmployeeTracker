USE employees_db;

INSERT INTO department (name) VALUES
("Sales"),
("HR"),
("Accounting"),
("Marketing"),
("Tech"),
("Corperate");

INSERT INTO role (title, salary, department_id) VALUES
("Web Developer", 120000, 5),
("Financial Analyst", 10000, 3),
("Marketing Coordinator", 70000, 4),
("Social Media Manager", 85000, 4),
("Accountant", 50000, 3),
("Sales Rep", 80000, 1),
("HR Manager", 90000, 2),
("HR Specialist", 60000, 2),
("CEO", 100000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Wallace", "Wallace", 6, 5),
("Shena", "Ashley", 4, 6),
("Andrea", "Sanderson", 7, 6),
("Damon", "Manunui", 8, 3),
("Magdelena", "León", 3, 6),
("Arthur", "Cross", 9, Null);