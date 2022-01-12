function toggle_like(dessert_name, action){
    if(action === 'unlike'){
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                dessert_name_give: dessert_name,
                action_give: action
            },
            success: function(response){
                console.log(response)
                window.location.reload()
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                dessert_name_give: dessert_name,
                action_give: action
            },
            success: function(response){
                console.log(response)
                window.location.reload()
            }
        })
    }
}