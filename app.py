from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from bson.objectid import ObjectId

from werkzeug.utils import secure_filename

# 날짜 시간을 다르는 함수 임포트하기
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

SECRET_KEY = 'SPARTA'

client = MongoClient('13.209.88.221', 27017, username="test", password="test")
db = client.dessert


@app.route('/upload')
def show_upload_page():
    return render_template('upload.html')


@app.route('/upload/update', methods=['POST'])
def upload_dessert():
    # 서버 쪽 디저트이름, 코멘트 받기 코드
    dessert_name_receive = request.form['dessert_name_give']
    comment_receive = request.form['comment_give']

    # 서버 쪽 파일 받기 코드
    img = request.files["file_give"]

    # 파일 이름 변경해주고 저장하기 (1) 일단, 확장자를 빼내기
    extension = img.filename.split('.')[-1]

    # 지금 날짜 시간 찍기
    today = datetime.now()

    # 날짜 시간을 원하는 형태로 변환하기
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    # 파일 이름 변경해주고 저장하기 (2) 새로운 이름을 만들어주기
    filename = f'img-{mytime}'

    # 파일 이름 변경해주고 저장하기 (3) 새로운 이름으로 저장하기
    save_to = f'static/{filename}.{extension}'
    img.save(save_to)

    # 파일 이름 변경해주고 저장하기 (4) 변경된 파일 이름을 db에도 저장하기
    doc = {
        'dessert_name': dessert_name_receive,
        'comment': comment_receive,
        'img': f'{filename}.{extension}',
        'time': today.strftime('%Y.%m.%d'),
        'count_like': 0,
    }

    db.dessert.insert_one(doc)

    return jsonify({'msg': '저장 완료!'})


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/sign_up/check_id_dup', methods=['POST'])
def check_id_dup(): # 아이디 체크
    # username_receive로 클라이언트가 준 username 받기
    username_receive = request.form['username_give']
    # username이 db에 하나라도 있으면 exists 존재하는 user, 없으면은 bool함수로 바꾸면 false 존재하지않음
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/check_email_dup', methods=['POST'])
def check_email_dup(): # 이메일 체크
    # useremail_receive로 클라이언트가 준 useremail 받기
    useremail_receive = request.form['useremail_give']
    # useremail이 db에 하나라도 있으면 exists 존재하는 user, 없으면은 bool함수로 바꾸면 false 존재하지않음
    exists = bool(db.users.find_one({"useremail": useremail_receive}))
    return jsonify({'result': 'success', 'exists': exists})


@app.route('/sign_up/save', methods=['POST'])
def sign_up(): # 회원가입
    username_receive = request.form['username_give'] # username_receive로 클라이언트가 준 username 받기
    password_receive = request.form['password_give'] # password_receive로 클라이언트가 준 password 받기
    useremail_receive = request.form['email_give'] # useremail_receive로 클라이언트가 준 useremail 받기
    # 패스워드 암호화
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # db에 삽입할 user 만들기
    doc = {
        "username": username_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "useremail": useremail_receive  # 이메일

    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route('/sign_in', methods=['POST'])
def sign_in(): # 로그인
    username_receive = request.form['username_give'] # username_receive로 클라이언트가 준 username 받기
    password_receive = request.form['password_give'] # password_receive로 클라이언트가 준 password 받기
    # print(username_receive, password_receive)

    # password는 hash 함수로 암호화 진행
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # 매칭되는 id와 pw값이 있는지 확인
    # 매칭이 성공한다면 로그인 성공
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})
    # 만약 result가 있다면
    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        ## decode 방법이 jwt.decode(token, secret key, algorithms으로 바뀜)
        # 로그인이 성공했다면 id와 jwt token 만들어서 발횅줍니다.
        # SECRET_KEY 로 암호화
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/update_like', methods=['POST'])
def update_like():
    # 토큰을 받아온다.
    token_receive = request.cookies.get('mytoken')

    try:
        # 받아온 토큰을 이용해서 유저 정보를 받아온다.
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        # 클라이언트가 보낸 요청에서 디저트의 _id 행동(like, unlike) 종류를 받아온다.
        dessert_id_receive = request.form["dessert_id_give"]
        action_receive = request.form["action_give"]

        # doc 딕셔너리에 유저와 디저트 _id, 행동을 저장한다.
        doc = {
            "dessert_id": dessert_id_receive,
            "username": user_info["username"],
            "action": action_receive
        }

        # 행동이 좋아요면 likes 콜렉션에 해당하는 디저트 _id와 유저이름, 행동을 저장하고 싫어요면 삭제한다
        # 행동이 좋아요면 dessert 콜렉션에서 해당하는 디저트의 좋아요 숫자를 +1, 싫어요면 -1
        if action_receive == "like":
            db.likes.insert_one(doc)
            db.dessert.update_one({'_id': ObjectId(dessert_id_receive)}, {'$inc': {'count_like': 1}})
        else:
            db.likes.delete_one(doc)
            db.dessert.update_one({'_id': ObjectId(dessert_id_receive)}, {'$inc': {'count_like': -1}})

        # 클라이언트에게 보내줄 dessert_id를 서버에서 갖고온다.
        # 해당하는 데이터를 받아올 때 ObjectId를 기준으로 갖고오는데, 파이썬에는 ObjectId 클래스가 내장되있지 않으므로 import 해줘야한다. (bson 패키지를 import해서 사용한다.)
        dessert_id = list(db.dessert.find({'_id': ObjectId(dessert_id_receive)}, {'_id': 1, "count_like": 1}))[0]["_id"]
        # 갖고 온 _id 값을 사용하기 위해서 형변환을 해준다.
        dessert_id = str(dessert_id)
        count = list(db.dessert.find({'_id': ObjectId(dessert_id_receive)}, {'_id': 1, "count_like": 1}))[0]["count_like"]

        return jsonify({"result": "success", 'msg': 'updated', "dessert_id": dessert_id, "count": count})

    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/', methods=['GET'])
def home():
    # 토큰을 받아온다.
    token_receive = request.cookies.get('mytoken')

    # 토큰이 없을 시 로그인 페이지로 이동
    if token_receive is None:
        return redirect(url_for("login"))


    # 디저트 리스트를 화면에 뿌려준다.
    dessert_list = list(db.dessert.find({}))

    # 이후에 _id 값을 가지고 라벨링을 하려면 그대로 쓰지 못하므로 형변환을 해준다.
    for dessert_id in dessert_list:
        dessert_id['_id'] = str(dessert_id['_id'])
    return render_template("index.html", dessert_list=dessert_list)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

