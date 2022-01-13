// index.html에서 좋아요, 싫어요 버튼에 달려있는 onclick 함수
// 서버에 해당 디저트 _id와 행동(좋아요, 싫어요)를 전달
function toggle_like(dessert_id, action){
    if(action === 'unlike'){
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                dessert_id_give: dessert_id,
                action_give: action
            },
            success: function(response){
                // 좋아요 숫자를 갱신해준다.
                $(`#${dessert_id}`).find('#like_count_num').text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                dessert_id_give: dessert_id,
                action_give: action
            },
            success: function(response){
                // 좋아요 숫자를 갱신해준다.
                $(`#${dessert_id}`).find('#like_count_num').text(response["count"])
            }
        })
    }
}