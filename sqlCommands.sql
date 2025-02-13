CREATE TABLE users(
    id serial NOT NULL,
    ceo text UNIQUE NOT NULL,
    date text
);
INSERT INTO users (ceo, date) VALUES
	('Иванов Иван Петрович', '6/15/85'),
	('Иванова Мария Сергеевна', '9/20/87'),
	('Иванов Алексей Иванович', '2/5/10'),
	('Иванова Елена Викторовна', '3/10/59'),
	('Петров Сергей Александрович', '12/5/82');

CREATE TABLE products(
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL,
    type text,
    price integer
);
INSERT INTO products (name, type, price) VALUES
	('Хлеб', 'Продукты', '50'),
	('Молоко', 'Продукты', '80'),
	('Бензин', 'Транспорт', '80'),
	('Билет в кино', 'Развлечения', '300'),
	('Зимнее пальто', 'Одежда', '8500'),
	('Учебники', 'Образование', '400'),
	('Лекарства', 'Здоровье', '25000'),
	('Погашение кредита', 'Кредиты', '89000'),
	('Смартфон в подарок', 'Подарки', '99900');


CREATE TABLE budget (
    id serial NOT NULL,
    ceo text UNIQUE REFERENCES users(ceo) NOT NULL,
    job text,
    org text,
    salary text,
    date text,
    PRIMARY KEY (id)
);
INSERT INTO budget (ceo, job, org, salary, date)
VALUES
('Иванов Иван Петрович', 'Инженер', 'ООО \"ТехноСервис\"', '85,000', '3/1/2015'),
('Иванова Мария Сергеевна', 'Бухгалтер', 'АО \"ФинансГрупп\"', '75,000', '4/15/2012'),
('Иванова Елена Викторовна', 'Репетитор', 'Частная практика', '15,000', '1/10/2020'),
('Петров Сергей Александрович', 'Таксист', 'Индивидуальная работа', '30,000', '9/1/2020');

CREATE TABLE transaction (
    id serial,
    date text,
    ceo text REFERENCES users(ceo) NOT NULL,
    name text REFERENCES products(name) NOT NULL,
    count integer NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO transaction (date, ceo, name, count) 
VALUES
	('2/1/25', 'Иванов Иван Петрович', 'Хлеб', '2'),
	('2/1/25', 'Иванов Иван Петрович', 'Молоко', '3'),
	('2/1/25', 'Иванов Иван Петрович', 'Молоко', '1'),
	('2/6/25', 'Иванова Мария Сергеевна', 'Зимнее пальто', '1'),
	('2/9/25', 'Петров Сергей Александрович', 'Бензин', '30'),
	('2/12/25', 'Иванова Елена Викторовна', 'Лекарства', '5'),
	('2/18/25', 'Иванов Иван Петрович', 'Погашение кредита', '1'),
	('2/22/25', 'Иванова Мария Сергеевна', 'Смартфон в подарок', '1'),
	('2/22/25', 'Иванов Алексей Иванович', 'Билет в кино', '1');
