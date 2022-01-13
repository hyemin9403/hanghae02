// 로그인
function sign_in() {
    // username(id), password 값 input으로 받기
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    // 만약 username이 빈칸 일 때("아이디를 입력해주세요.")
    if (username == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-username").focus()
        return;
    // 그렇지 않다면 넘어갑니다.
    } else {
        $("#help-id-login").text("")
    }
    // 만약 password가 빈칸 일 때("비밀번호를 입력해주세요.")
    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    // 그렇지 않다면 넘어갑니다.
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            // 서버 /sign_in 으로 username,password를 보냅니다.
            username_give: username,
            password_give: password
        },
        success: function (response, event) {
            // 만약에 검증을 통과 했다면 서버에 토큰이 발행된다.
            // 토큰에는 검증 받은사람의 id 검증이 유효한 시간(exp) 포함
            if (response['result'] == 'success') {
                // 쿠키의 키 'mytoken' 밸류 response['token']
                // 토큰을 받아서 브라우저 쿠키에 저장
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            // 그렇지 않으면 서버 msg를 alert 띄웁니다.
            } else {
                alert(response['msg'])
            }
        }
    });
}

// 회원가입 완료 버튼
function sign_up() {
    // username, password, password2, useremail 값 input 으로 받기
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let password2 = $("#input-password2").val()
    let useremail = $("#input-email").val()
    console.log(username, password, password2, useremail) // 완료


    //is-success를 가지고 있으면 아이디 중복확인을 마친거
    // 만약에 is-success 가지고 있지 않다면 alert
    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) {
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    // 만약 password가 빈칸 일 경우 ("비밀번호를 입력해주세요.")
    if (password == "") {
        $("#help-password").text("비밀번호를 입력해주세요.").addClass("is-danger")
        $("#input-password").focus()
        return;
    // is_password(정규식표현)에 password가 포함이 안되면 입력창 아래에 ("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자")
    } else if (!is_password(password)) {
        $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").addClass("is-danger")
        $("#input-password").focus()
        return
    // 그렇지 않다면 ("사용할 수 있는 비밀번호입니다.")
    } else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    // 만약 password2가 빈칸 일 경우 ("비밀번호를 다시 입력해주세요.")
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 다시 입력해주세요.").addClass("is-danger")
        $("#input-password2").focus()
        return;
    // password2 와 password가 같은지 검사하고 같지않으면 ("비밀번호가 일치하지 않습니다.")
    } else if (password2 != password) {
        $("#help-password2").text("비밀번호가 일치하지 않습니다.").addClass("is-danger")
        $("#input-password2").focus()
        return;
    // password2 와 password가 같으면 ("비밀번호가 일치합니다.")
    } else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }

    //is-success를 가지고 있지 않다면 ("이메일 중복확인을 해주세요.")
    if (!$("#help-email").hasClass("is-success")) {
        alert("이메일 중복확인을 해주세요.")
        return;
    }

    // username,password,useremail 위에 충족할 시 회원가입 완료
    $.ajax({
        type: "POST",
        url: "/sign_up/save",
        data: {
            username_give: username,
            password_give: password,
            email_give: useremail
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}

// 로그인화면 회원가입 버튼
function toggle_sign_up() {
    $("#input-username").val("") // 로그인창 id입력창 입력 후 회원가입 버튼 누르면 빈칸
    $("#input-password").val("") // 로그인창 pw입력창 입력 후 회원가입 버튼 누르면 빈칸
    $("#sign-up-box").toggleClass("is-hidden") // 회원가입시에만 보이는 요소
    $("#div-sign-in-or-up").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#help-id-login").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#help-password-login").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#btn-check-dup").toggleClass("is-hidden") //중복확인
    $("#help-id").toggleClass("is-hidden") // 회원가입 id입력시 설명
    $("#help-password").toggleClass("is-hidden") // 회원가입 pw입력시 설명

}

// ID, PW, EMAIL 정규표현식
// 2자에서 10자 이내 최소 1개의 영문 입력.
function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

// 8자에서 20자 이내 최소 1개의 영문, 숫자, 특수문자 입력.
function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function is_email(asValue) {
    var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(asValue);
}

// ID 중복확인
function check_id_dup() {
    // username 값 input으로 받기
    let username = $("#input-username").val()

    //만약에 username가 아무런 값을 입력하지 않으면 입력창 아래에 ("아이디를 입력해주세요.")
    if (username == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    // 만약에 is_nickname(정규식표현)에 username이 포함이 안되면 입력창 아래에 ("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이")
    if (!is_nickname(username)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    // 위에 형식이 적합한 경우 서버에 username이 중복되는지 확인
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_id_dup",
        data: {
            username_give: username
        },
        success: function (response) {
            // 만약에 username이 중복된다면 입력창 아래에 ("이미 존재하는 아이디입니다.")
            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            // 그렇지 않다면 ("사용할 수 있는 아이디입니다.")
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

// EMAIL 중복확인
function check_email_dup() {
    // useremail 값 input 으로 받기
    let useremail = $("#input-email").val()
    console.log(useremail)
    // 만약에 useremail가 아무런 값을 입력하지 않으면 입력창 아래에 ("이메일를 입력해주세요.")
    if (useremail == "") {
        $("#help-email").text("이메일를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-email").focus()
        return;
    }
    //만약에 is_email(정규식표현)에 useremail이 포함이 안되면 입력창 아래에 ("이메일의 형식을 확인해주세요.")
    if (!is_email(useremail)) {
        $("#help-email").text("이메일의 형식을 확인해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-email").focus()
        return;
    }
    // 위에 형식이 적합한 경우 서버에 useremail이 중복되는지 확인
    $("#help-email").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_email_dup",
        data: {
            useremail_give: useremail
        },
        success: function (response) {

            // 만약에 useremail이 중복된다면 입력창 아래에 ("이미 존재하는 이메일입니다.")
            if (response["exists"]) {
                $("#help-email").text("이미 존재하는 이메일입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-email").focus()
            // 그렇지 않다면 ("사용할 수 있는 이메일입니다.")
            } else {
                $("#help-email").text("사용할 수 있는 이메일입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-email").removeClass("is-loading")

        }
    })
    ;
}