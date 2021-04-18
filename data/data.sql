ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY statuses DROP CONSTRAINT IF EXISTS fk_status_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY users DROP CONSTRAINT IF EXISTS fk_users_board_id CASCADE;

DROP TABLE IF EXISTS boards;
CREATE TABLE boards (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined',
    owner integer,
    open boolean
);

DROP TABLE IF EXISTS statuses;
CREATE TABLE statuses (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined',
    board_id integer NOT NULL
);

DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id serial NOT NULL PRIMARY KEY,
    board_id integer NOT NULL,
    title text DEFAULT 'Undefined',
    status_id integer NOT NULL,
    "order" serial NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    username text,
    password text,
    email_address text
);

ALTER TABLE cards
    ADD CONSTRAINT fk_card_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE cards
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE statuses
    ADD CONSTRAINT fk_status_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE boards
    ADD CONSTRAINT fk_board_user_id FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE;

INSERT INTO boards (title, open) VALUES ('Board 1', 'true'), ('Board 2', 'true');

INSERT INTO statuses (title, board_id) VALUES ('new', 1), ('new', 2), ('in progress', 1), ('in progress', 2), ('testing', 1), ('testing', 2), ('done', 1), ('done', 2);

INSERT INTO cards (board_id, title, status_id, "order") VALUES (1, 'new cad 1', 1, 0),
                         (1, 'new card 2', 1, 1),
                         (1, 'in progress card', 2, 0),
                         (1, 'planning', 3, 0),
                         (1, 'done card 1', 4, 0),
                         (1, 'done card 2', 4, 1),
                         (2, 'new card 1', 5, 0),
                         (2, 'new card 2', 5, 1),
                         (2, 'in progress card', 6, 0),
                         (2, 'planning', 7, 0),
                         (2, 'done card 1', 8, 0),
                         (2, 'done card 2', 8, 1);

INSERT INTO users (username, password, email_address) VALUES ('Gergő', '$2b$12$oeYCEw3yzM27qdN3DmsADOu26BDuh4jywTx7Ky07sE9XOnsJXDpPK', 'gergő@admin.com'),
                                                             ('Joel', '$2b$12$z3eXMhfgs1cF2GkuVDngwO81C.4lIr6AxBpvkCTJqqpbGMPZ4Bbwm', 'joel@admin.com'),
                                                             ('Adam', '$2b$12$Ec6L63fOL.CZ5v/MMm6EI.fdryBMSbAQx43VAm6xzyK5NqR79fcJ.', 'adam@admin.com'),
                                                             ('Alex', '$2b$12$g953xJ8xSmKZMZGAdphV0eI7aTAk5qe3d5VjQtdhuR/Ql9NeiMnC2', 'alex@admin.com');
