// 로그인
function sign_in() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()

    if (username == "") {
        $("#help-id-login").text("아이디를 입력해주세요.")
        $("#input-username").focus()
        return;
    } else {
        $("#help-id-login").text("")
    }

    if (password == "") {
        $("#help-password-login").text("비밀번호를 입력해주세요.")
        $("#input-password").focus()
        return;
    } else {
        $("#help-password-login").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password
        },
        success: function (response, event) {
            if (response['result'] == 'success') {
                // 쿠키의 키 'mytoken' 밸류 response['token']
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}

// 회원가입 완료 버튼
function sign_up() {
    let username = $("#input-username").val()
    let password = $("#input-password").val()
    let password2 = $("#input-password2").val()
    let useremail = $("#input-email").val()
    console.log(username, password, password2, useremail) // 완료


    if ($("#help-id").hasClass("is-danger")) {
        alert("아이디를 다시 확인해주세요.")
        return;
    } else if (!$("#help-id").hasClass("is-success")) { //is-success를 가지고 있지 않다면
        alert("아이디 중복확인을 해주세요.")
        return;
    }

    if (password == "") {
        $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return;
    } else if (!is_password(password)) {
        $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
        $("#input-password").focus()
        return
    } else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 다시 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else if (password2 != password) {
        $("#help-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }

    if (!$("#help-email").hasClass("is-success")) { //is-success를 가지고 있지 않다면
        alert("이메일 중복확인을 해주세요.")
        return;
    }

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
    $("#input-username").val("")
    $("#input-password").val("")
    $("#sign-up-box").toggleClass("is-hidden") // 회원가입시에만 보이는 요소
    $("#div-sign-in-or-up").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#help-id-login").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#help-password-login").toggleClass("is-hidden") // 로그인창에서 보이는 요소
    $("#btn-check-dup").toggleClass("is-hidden") //중복확인
    $("#help-id").toggleClass("is-hidden") // 회원가입 id입력시 설명
    $("#help-password").toggleClass("is-hidden") // 회원가입 pw입력시 설명

}

// ID, PW, EMAIL 정규표현식
function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

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
    let username = $("#input-username").val()

    if (username == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    if (!is_nickname(username)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_id_dup",
        data: {
            username_give: username
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

// EMAIL 중복확인
function check_email_dup() {
    let useremail = $("#input-email").val()
    console.log(useremail)
    if (useremail == "") {
        $("#help-email").text("이메일를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-email").focus()
        return;
    }
    if (!is_email(useremail)) {
        $("#help-email").text("이메일의 형식을 확인해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-email").focus()
        return;
    }
    $("#help-email").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_email_dup",
        data: {
            useremail_give: useremail
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-email").text("이미 존재하는 이메일입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-email").focus()
            } else {
                $("#help-email").text("사용할 수 있는 이메일입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-email").removeClass("is-loading")

        }
    })
    ;
}