import connection
from psycopg2.extras import RealDictCursor


@connection.connection_handler
def get_card_status(cursor: RealDictCursor, id):
    query = """
        SELECT title
        FROM statuses
        WHERE id = %(id)s"""
    cursor.execute(query, {'id': id})
    return cursor.fetchall()


@connection.connection_handler
def get_cards_for_board(cursor: RealDictCursor, board_id):
    query = """
    select cards.id, board_id, cards.title, status_id, "order"
    from cards join statuses on
    cards.status_id = statuses.id
    where board_id = %(board_id)s;
        """
    cursor.execute(query, {'board_id': board_id})
    return cursor.fetchall()


@connection.connection_handler
def get_boards(cursor: RealDictCursor):
    query = """
        SELECT id, title
        FROM boards
        ORDER BY id"""
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def get_title_boards(cursor: RealDictCursor):
    query = """
        SELECT title
        FROM boards"""
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def card_title_change(cursor: RealDictCursor, id, title):
    query = f"UPDATE cards SET title='{title}' WHERE id={id}"
    cursor.execute(query)


@connection.connection_handler
def update_board_title(cursor: RealDictCursor, board_id, title):
    query = f"UPDATE boards SET title='{title}' WHERE id={board_id}"
    cursor.execute(query)


@connection.connection_handler
def update_status_title(cursor: RealDictCursor, status_id, title):
    query = f"UPDATE statuses SET title='{title}' WHERE id={status_id}"
    cursor.execute(query)
    return ""


@connection.connection_handler
def update_card_status(cursor: RealDictCursor, cardId, newStatusId):
    query = f"UPDATE cards SET status_id={int(newStatusId)} WHERE id={cardId}"
    cursor.execute(query)
    return ""


@connection.connection_handler
def get_cards(cursor: RealDictCursor):
    query = """
        SELECT id, board_id, title, status_id, "order"
        FROM cards
        ORDER BY id"""
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor: RealDictCursor):
    query = """
        SELECT id, title
        FROM statuses"""
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def get_status(cursor: RealDictCursor, status_id):
    query = f"SELECT * FROM statuses WHERE id={int(status_id)}"
    cursor.execute(query)
    return cursor.fetchone()


@connection.connection_handler
def add_new_card(cursor: RealDictCursor, data):
    query = """
    INSERT INTO cards (id, board_id, title, status_id, "order")
    VALUES  ((select max(id) from cards) + 1, %(board_id)s, %(title)s, (0), (0));
    select * from cards 
    order by id desc
    limit 1"""
    cursor.execute(query, {
        'board_id': data["boardId"],
        'title': data["title"]
    })
    return cursor.fetchone()


@connection.connection_handler
def add_new_column(cursor: RealDictCursor, data):
    add_col_query = f"INSERT INTO statuses VALUES ((SELECT MAX(id) from statuses) + 1, '{data['statusId']}');"
    add_many_to_many_col = f"INSERT INTO board_status VALUES ({data['boardId']}, (SELECT MAX(id) from statuses));"
    query = add_col_query + add_many_to_many_col
    cursor.execute(query)
    cursor.execute(f"SELECT MAX(id) as id from statuses")
    return cursor.fetchone()


@connection.connection_handler
def get_statutes_board(cursor: RealDictCursor, board_id):
    query1 = f"SELECT statuses_id FROM board_status WHERE board_id={int(board_id)}"
    cursor.execute(query1)
    result1 = cursor.fetchall()
    list_id = [str(result['statuses_id']) for result in result1]
    query = f"SELECT id, title FROM public.statuses WHERE id IN ({', '.join(list_id)})"
    cursor.execute(query)
    board_statuses = cursor.fetchall()
    return board_statuses


@connection.connection_handler
def greatest_board_id(cursor: RealDictCursor):
    query = """
    SELECT MAX(id) id
    FROM boards
    """
    cursor.execute(query)
    return cursor.fetchone()['id']


@connection.connection_handler
def add_board(cursor: RealDictCursor, data) -> list:
    query = """
    INSERT INTO boards (id, title)
    VALUES  ((select max(id) from boards) + 1, %(title)s);
    """
    cursor.execute(query, {
        'title': data['title']
    })
    for state in range(4):
        init_states_query = f"INSERT INTO board_status VALUES((select max(id) from boards), {state})"
        cursor.execute(init_states_query)
    return 0


@connection.connection_handler
def delete_board(cursor: RealDictCursor, data) -> list:
    query = """
    DELETE FROM boards 
    WHERE id = %(data)s
    """
    cursor.execute(query, {
        'data': data
    })
    return ""


@connection.connection_handler
def delete_card(cursor: RealDictCursor, cardId):
    query = f"DELETE FROM cards WHERE id={int(cardId)}"
    cursor.execute(query)
    return ""


@connection.connection_handler
def delete_column(cursor: RealDictCursor, boardId, statusId):
    status_id = str(status_id)
    query = f"DELETE FROM cards WHERE status_id={status_id} AND board_id={boardId}"
    delete_column_query = f"DELETE FROM board_status WHERE board_id={boardId} AND statuses_id={status_id}"
    cursor.execute(query)
    cursor.execute(delete_column_query)
    return ""
