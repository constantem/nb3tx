$(document).ready(function () {
    let fast = $(".content.row");
    fast.append(
        "<div class=\"fast-features-div\">" +
        "<button class=\"open-fast-features-btn\" >快速選單</button>" +
        "<div id=\"fast-features-content\" style=\"display: none;\">" +
        "<div>" +
        "<p class=\"title\">常用功能</p>" +
        "<ul class=\"content\">" +
        "<li><a href=\"#\">臺幣帳戶明細</a></li>" +
        "<li><a href=\"#\">外幣帳戶總覽</a></li> " +
        "</ul>" +
        "</div>" +
        "<div>" +
        "<p class=\"title\">我的最愛</p>" +
        "<ul class=\"content\">" +
        "<li><a href=\"#\">帳單查詢及繳款</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">臺幣貸款查詢</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">定期定額</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">帳單查詢及繳款</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">臺幣貸款查詢</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">定期定額</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "<li><a href=\"#\">帳單查詢及繳款</a><button type=\"button\" onclick=\"alert('test')\"><i class=\"fas fa-trash\"></i></button></li>" +
        "</ul>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
    $(".open-fast-features-btn").click(function () {
        const x = document.getElementById("fast-features-content");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    })

})
