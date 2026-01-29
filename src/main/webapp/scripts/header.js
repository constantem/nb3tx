header ='<nav>\
        <header>\
		<div id="desk-header" class="row">\
			<div class="header-logo col-4"><a href="#"><img src="../img/tbb_logo_white_onlinebanking_trial.svg"></a></div>\
			<div class="col-8 text-right">\
			<a href="" data-toggle="tooltip" data-placement="top" title="消息提示">\
			<div style="display: inline;">\
			<img style="cursor: pointer;" src="../img/bell.png" alt="">\
					<span style="font-size: 20px; position: relative;"></span>\
						<span style="font-size: 16px; position: absolute; left: 272px; top: 15px; border-radius: 20px; height: 20px; width: 36px; display: inline-block; background: #FFFFFF; vertical-align: top;">\
						<span style="display: block; color: #FF0000; height: 20px; line-height: 20px; text-align: center; font-weight: 600;">3</span>\
					</span>\
			</a>\
	   		</div>\
				<a>臺灣企銀首頁</a>\
				<div class="dropdown">\
					<span>憑證管理</span>\
					<div class="dropdown-content">\
						<ul>\
							<li>\
								<a href="#">憑證註冊中心</a></li>\
							<li>\
								<a href="#">變更憑證密碼</a></li>\
						</ul>\
					</div>\
				</div>\
				<a href="#">網站地圖</a>\
				<!-- 多語系選項 -->\
				<select class="login-custom-select multi-lang-select">\
					<option value="1">繁體</option>\
					<option value="2">英文</option>\
					<option value="3">簡體</option>\
				</select>\
			</div>\
		</div>\
		<div id="mobile-header">\
			<img class="mobile-logo" src="../img/tbb_logo_white_onlinebanking_trial.svg">\
			<button class="hamburger hamburger--spring" type="button" href="#header-content" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="header-content">\
				<span class="hamburger-box">\
					<span class="hamburger-inner"></span>\
				</span>\
			</button>\
		</div>\
	</header>\
    </nav>';
document.write(header);
function openFastFeatures() {
	var x = document.getElementById("fast-features-content");
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
		}
	}