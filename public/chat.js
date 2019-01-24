var me = false;
$(function() {
    var socket = io.connect ("http://localhost:4200");
    var username = document.getElementById("username").innerHTML;
    var message = $("#message_text");
    var send_message = $("#send_message");
    var message_box = $("#message_box");
    console.log ("user is " + username);
    send_message.click (function () {
        me = true;
        if(message != "") {
            console.log("msg = " + message);
            socket.emit ("new_msg", {message: message.val()});
            document.getElementById("message_text").value = "";
        }
    });
    socket.on ("new_msg", (data) => {
        if(data.message != "") {
            console.log ("data is: " + data);
            class_me = "";
            if (me) {
                class_me = "me";
            }
            message_box.append ("<div class = 'message " + class_me + "'> <span class = 'msg_username'>" + data.username + "<br></span> <span class = 'msg_actual'>" + data.message + "</span> </div>");
        }
        me = false;
    })
    socket.emit("username", {username: username});
})