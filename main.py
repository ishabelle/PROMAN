from flask import Flask, render_template, url_for, request

from util import json_response
import util

import data_handler

app = Flask(__name__)

# Joel: joel123
# Adam: adam123
# Alex: alex123
# Gergő: gergo123


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    return data_handler.get_all_from_table('boards')


@app.route("/get-cards")
@json_response
def get_all_cards():
    return data_handler.get_all_from_table('cards')


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_all_from_table('statuses')


@app.route('/create-new-board', methods=['GET', 'POST'])
@json_response
def create_new_board():
    data_handler.create_new_board()
    top_board = data_handler.get_last_board()
    data_handler.create_status(top_board[0]['id'])
    return top_board


@app.route('/create-private-board', methods=['GET', 'POST'])
@json_response
def create_private_board():
    data = request.get_json()
    data_handler.create_new_board(int(data['owner']))
    top_board = data_handler.get_last_board()
    data_handler.create_status(top_board[0]['id'])
    return top_board


@app.route("/create-card", methods=["GET", "POST"])
@json_response
def create_card():
    data = request.get_json()
    data_handler.create_card(data["board_id"], data["status_id"])
    return data_handler.get_all_from_table('cards')


@app.route("/delete-card", methods=["GET", "POST"])
@json_response
def delete_card():
    card_id = request.get_json()
    response = data_handler.delete_card(card_id)
    return response


@app.route("/rename", methods=['GET', 'POST'])
@json_response
def rename():
    data = request.get_json()
    response = data_handler.rename_board(data["title"], data["id"])
    return response


@app.route('/drag&drop', methods=['GET', 'POST'])
@json_response
def drag_and_drop():
    data = request.get_json()
    response = data_handler.update_status(data['new_id'], data['old_id'])
    return response


@app.route("/rename-status", methods=['GET', 'POST'])
@json_response
def rename_status():
    data = request.get_json()
    response = data_handler.rename_status(data["title"], data["id"])
    return response


@app.route("/rename-card", methods=['GET', 'POST'])
@json_response
def rename_card():
    data = request.get_json()
    response = data_handler.rename_card(data["title"], data["id"])
    return response


@app.route("/create-status", methods=["GET", "POST"])
def create_status():
    data = request.get_json()
    data_handler.add_status(data["board_id"])
    return data_handler.get_last_status()[0]


@app.route("/delete-board", methods=["GET", "POST"])
@json_response
def delete_board():
    board_id = request.get_json()
    response = data_handler.delete_board(board_id)
    return response


@app.route("/board-open-close", methods=["GET", "POST"])
@json_response
def board_open_close():
    data = request.get_json()
    response = data_handler.change_board_open_close(data['boolean'], data['id'])
    return response


@app.route('/check_username', methods=['GET', 'POST'])
@json_response
def check_username():
    data = request.get_json()
    response = data_handler.check_user_data('username', data['username'])
    return response


@app.route('/check_email', methods=['GET', 'POST'])
@json_response
def check_email():
    data = request.get_json()
    response = data_handler.check_user_data('email_address', data['email'])
    return response


@app.route('/check_passwords', methods=['GET', 'POST'])
@json_response
def check_passwords():
    data = request.get_json()
    psw = util.hash_password(data['psw'])
    if not util.verify_password(data['pswAgain'], psw):
        return 'True'
    else:
        return 'False'


@app.route('/save_data', methods=['GET', 'POST'])
@json_response
def save_data():
    data = request.get_json()
    psw = util.hash_password(data['password'])
    data_handler.save_data(data['username'], data['email'], psw)
    return 'done'


@app.route('/check_login', methods=['GET', 'POST'])
@json_response
def check_login():
    data = request.get_json()
    if data_handler.check_user_data('username', data['username']) == 'True':
        real_psw = data_handler.password_by_username(data['username'])
        if not util.verify_password(data['password'], real_psw[0]['password']):
            return 'False'
        else:
            return real_psw[0]['id']
    else:
        return 'False'


def main():
    app.run(debug=True, port=5000)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
