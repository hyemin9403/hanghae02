$(document).ready(function () {
    bsCustomFileInput.init()
})

function posting() {
    let dessert_name = $('#title').val()
    let comment = $("#content").val()

    let file = $('#file')[0].files[0]
    let form_data = new FormData()

    form_data.append("file_give", file)
    form_data.append("dessert_name_give", dessert_name)
    form_data.append("comment_give", comment)

    $.ajax({
        type: "POST",
        url: "/upload/update",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response["msg"])
            window.location.replace("/")
        }
    });
}