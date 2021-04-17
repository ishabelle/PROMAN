ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;

DROP TABLE IF EXISTs public.boards;
CREATE TABLE boards (
    id serial NOT NULL,
    title text
);

DROP TABLE IF EXISTs public.cards;
CREATE TABLE cards (
    id serial NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    "order" integer
);

DROP TABLE IF EXISTs public.statuses;
CREATE TABLE statuses (
    id serial NOT NULL,
    title text
);

ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_board_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_card_id PRIMARY KEY (id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_status_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

DROP TABLE IF EXISTS public.board_status;
CREATE TABLE board_status(
    board_id INT REFERENCES public.boards (id) ON UPDATE CASCADE ON DELETE CASCADE,
    statuses_id INT REFERENCES public.statuses (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT board_status_pk PRIMARY KEY (board_id, statuses_id)
);

-- INSERT TABLES
-- STATUSES
-- INSERT INTO statuses VALUES (0, 'new');
-- INSERT INTO statuses VALUES (1, 'in progress');
-- INSERT INTO statuses VALUES (2, 'testing');
-- INSERT INTO statuses VALUES (3, 'done');