CREATE TABLE IF NOT EXISTS room(
	id integer PRIMARY KEY AUTOINCREMENT,
	name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user(
	id integer PRIMARY KEY AUTOINCREMENT,
	id_room integer,
	name text NOT NULL UNIQUE,
	password text NOT NULL,
	FOREIGN KEY(id_room) REFERENCES room(id)
);

CREATE TABLE IF NOT EXISTS paint(
	id integer PRIMARY KEY AUTOINCREMENT,
	id_room integer NOT NULL,
	id_user integer NOT NULL,
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
	FOREIGN KEY(id_room) REFERENCES room(id),
	FOREIGN KEY(id_user) REFERENCES user(id)
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
	time date DEFAULT(strftime('%Y-%m-%d %H:%M:%S', 'NOW', 'utc')),
	FOREIGN KEY(id_room) REFERENCES room(id),
	FOREIGN KEY(id_user) REFERENCES user(id)
);

INSERT INTO user VALUES (NULL, NULL, 'hugo', '12345');
INSERT INTO user VALUES (NULL, NULL, 'ricardo', '12345');
INSERT INTO user VALUES (NULL, NULL, 'daniel', '12345');
INSERT INTO user VALUES (NULL, NULL, 'joao', '12345');
INSERT INTO user VALUES (NULL, NULL, 'carlos', '12345');