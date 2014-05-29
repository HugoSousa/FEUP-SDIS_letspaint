CREATE TABLE IF NOT EXISTS room(
	id integer PRIMARY KEY AUTOINCREMENT,
	name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user(
	id integer PRIMARY KEY AUTOINCREMENT,
	id_room integer NOT NULL,
	name text NOT NULL UNIQUE,
	password text NOT NULL,
	FOREIGN KEY(id_room) REFERENCES room(id)
);

CREATE TABLE IF NOT EXISTS paint(
	id integer PRIMARY KEY AUTOINCREMENT,
	id_room integer NOT NULL,
	type text NOT NULL,
	line_id text,
	line_width integer NOT NULL,
	pos_x integer NOT NULL,
	pos_y integer NOT NULL,
	color text NOT NULL,
	width integer,
	height integer,
	text text,
	time date DEFAULT(strftime('%Y-%m-%d %H:%M:%f', 'NOW', 'utc')),
	FOREIGN KEY(id_room) REFERENCES room(id)
);

CREATE TABLE IF NOT EXISTS gallery(
	url text PRIMARY KEY,
	id_user integer NOT NULL,
	FOREIGN KEY (id_user) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS chat(
	id integer PRIMARY KEY AUTOINCREMENT,
	message text NOT NULL,
	id_room integer NOT NULL,
	id_user integer NOT NULL,
	time date DEFAULT(strftime('%H:%M:%S', 'NOW', 'utc')),
	FOREIGN KEY(id_room) REFERENCES room(id),
	FOREIGN KEY(id_user) REFERENCES user(id)
);


INSERT INTO room VALUES (NULL, 'nome da room1');
INSERT INTO room VALUES (NULL, 'nome da room2');
INSERT INTO room VALUES (NULL, 'nome da room3');
INSERT INTO room VALUES (NULL, 'nome da room4');

INSERT INTO user VALUES (NULL, 2, 'hugo', '12345');
INSERT INTO user VALUES (NULL, 2, 'ricardo', '12345');
INSERT INTO user VALUES (NULL, 2, 'daniel', '12345');
INSERT INTO user VALUES (NULL, 3, 'joao', '12345');
INSERT INTO user VALUES (NULL, 3, 'carlos', '12345');

INSERT INTO paint (id_room, type, line_width, pos_x, pos_y, color) VALUES (2, 'brush', 10, 100, 200, '000000');
INSERT INTO paint (id_room, type, line_width, pos_x, pos_y, color) VALUES (2, 'brush', 10, 101, 201, '000000');
INSERT INTO paint (id_room, type, line_width, pos_x, pos_y, color) VALUES (2, 'brush', 10, 102, 202, '000000');