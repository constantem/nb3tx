function checkTime(func, hours, minutes) {
    let today = new Date();
    let dateLine = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    func(today > dateLine);
}

function singlePurchase(isTimeOut) {
    if (isTimeOut) {
        location.href = '../單筆申購/P7.html'
    } else {
        location.href = '../單筆申購/P1.html'
    }
}

header = '<nav>\
        <nav id="ttb-menu">\
			<ul id="nav-menu" class="menu-list d-inline-block" style="max-width: fit-content">\
				<li>\
					<a href="#" class="collapsed">\
						<div class="menu-img-block"><img src="../img/menu-icon-01.svg"></div>\
						<p class="menu-title">我的首頁</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed">\
						<div class="menu-img-block"><img src="../img/menu-icon-02.svg"></div>\
						<p class="menu-title">帳戶總覽</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#main-fuct-03" class="collapsed nav-menu" onclick="main-fuct-03" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-03">\
						<div class="menu-img-block"><img src="../img/menu-icon-03.svg"></div>\
						<p class="menu-title">臺幣服務</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#main-fuct-04" class="collapsed" onclick="main-fuct-04" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-04">\
						<div class="menu-img-block"><img src="../img/menu-icon-04.svg"></div>\
						<p class="menu-title">外幣服務</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-05" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-05">\
						<div class="menu-img-block"><img src="../img/menu-icon-05.svg"></div>\
						<p class="menu-title">繳費繳稅</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-06" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-06">\
						<div class="menu-img-block"><img src="../img/menu-icon-06.svg"></div>\
						<p class="menu-title">貸款服務</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-07" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-07">\
						<div class="menu-img-block"><img src="../img/menu-icon-07.svg"></div>\
						<p class="menu-title">基金/債券</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-08" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-08">\
						<div class="menu-img-block"><img src="../img/menu-icon-08.svg"></div>\
						<p class="menu-title">黃金存摺</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-09" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-09">\
						<div class="menu-img-block"><img src="../img/menu-icon-09.svg"></div>\
						<p class="menu-title">信用卡</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-10" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-10">\
						<div class="menu-img-block"><img src="../img/menu-icon-10.svg"></div>\
						<p class="menu-title">線上服務專區</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-11" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-11">\
						<div class="menu-img-block"><img src="../img/menu-icon-11.svg"></div>\
						<p class="menu-title">個人服務</p>\
					</a>\
				</a></li>\
				<li>\
					<a href="#" class="collapsed" onclick="main-fuct-12" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="main-fuct-12">\
						<div class="menu-img-block"><img src="../img/menu-icon-12.svg"></div>\
						<p class="menu-title">網路投保</p>\
					</a>\
				</a></li>\
			</ul>\
		</nav>\
		<div id="tbb-sec-menu-bg">\
			<nav id="ttb-sec-menu">\
				<div class="sec-menu collapse" id="main-fuct-03" aria-labelledby="main-fuct-03" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">帳戶查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="#">帳戶餘額查詢</a></li>\
								<li><a href="#">帳戶明細查詢</a></li>\
								<li><a href="#">虛擬帳號入帳明細</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">轉帳交易</p>\
							<ul class="third-menu-list">\
								<li><a href="../臺幣轉帳/P1-1.html">轉帳交易</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">轉出記錄</p>\
							<ul class="third-menu-list">\
								<li><a href="#">轉出記錄查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">預約交易</p>\
							<ul class="third-menu-list">\
								<li><a href="#">預約交易查詢/取消</a></li>\
								<li><a href="#">預約交易結果查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">定存服務</p>\
							<ul class="third-menu-list">\
								<li><a href="#">轉入綜存定存</a></li>\
								<li><a href="#">定存明細查詢</a></li>\
								<li><a href="#">定存自動轉期申請/變更</a></li>\
								<li><a href="#">定存單到期續存</a></li>\
								<li><a href="#">綜存定存解約</a></li>\
								<li><a href="#">零存整付按月繳存</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">輕鬆理財戶</p>\
							<ul class="third-menu-list">\
								<li><a href="#">存摺明細</a></li>\
								<li><a href="#">證券交割明細</a></li>\
								<li><a href="#">自動申購基金明細</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">票據查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="#">託收票據明細</a></li>\
								<li><a href="#">支存當日不足扣票據明細</a></li>\
								<li><a href="#>已兌現票據明細</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">中央登錄債券</p>\
							<ul class="third-menu-list">\
								<li><a href="#">中央登錄債券餘額</a></li>\
								<li><a href="#">中央登錄債券明細</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">質借功能取消</p>\
							<ul class="third-menu-list">\
								<li><a href="#">質借功能取消</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-04" aria-labelledby="main-fuct-04" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">帳戶查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="#">帳戶餘額查詢</a></li>\
								<li><a href="#">活存明細查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">換匯/轉帳交易</p>\
							<ul class="third-menu-list">\
								<li><a href="../外匯結購售轉帳/P1.html">買賣外幣/約定轉帳</a></li>\
							</ul>\
						</div>\
                        <div class="sec-menu-item">\
							<p class="sec-menu-title">轉出記錄</p>\
							<ul class="third-menu-list">\
								<li><a href="#">轉出記錄查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">匯出匯款</p>\
							<ul class="third-menu-list">\
								<li><a href="#">匯出匯款</a></li>\
								<li><a href="#">匯出匯款查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">匯入匯款</p>\
							<ul class="third-menu-list">\
								<li><a href="#">匯入匯款查詢</a></li>\
								<li><a href="#">線上解款</a></li>\
								<li><a href="#">線上解款申請/註銷</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">預約交易</p>\
							<ul class="third-menu-list">\
								<li><a href="#">預約交易查詢/取消</a></li>\
								<li><a href="#">預約交易結果查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">定存服務</p>\
							<ul class="third-menu-list">\
								<li><a href="#">轉入外幣綜存定存</a></li>\
								<li><a href="#">定存明細查詢</a></li>\
								<li><a href="#">綜存定存解約</a></li>\
								<li><a href="#">定存自動轉期申請/變更</a></li>\
								<li><a href="#">存單到期續存</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">進出口服務</p>\
							<ul class="third-menu-list">\
								<li><a href="#">進口到單查詢</a></li>\
								<li><a href="#">出口押匯查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">信用狀服務</p>\
							<ul class="third-menu-list">\
								<li><a href="#">通知查詢</a></li>\
								<li><a href="#">開狀查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">託收查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="#">進口/出口託收查詢</a></li>\
								<li><a href="#">光票託收查詢</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-05" aria-labelledby="main-fuct-05" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">繳稅</p>\
							<ul class="third-menu-list">\
								<li><a href="../繳稅/P1.html">繳稅</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">公用事業費</p>\
							<ul class="third-menu-list">\
								<li><a href="../電費/P1.html">臺灣電力公司</a></li>\
								<li><a href="../臺灣省水費/P1.html">臺灣自來水公司</a></li>\
								<li><a href="../臺北市水費/P1.html">臺北市自來水事業處</a></li>\
								<li><a href="../欣欣瓦斯費/P1.html">欣欣瓦斯</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">健保/勞保/國保/勞退金</p>\
							<ul class="third-menu-list">\
								<li><a href="../健保費補充保險費/P1.html">健保費/補充保險費</a></li>\
								<li><a href="../勞保費/P1.html">勞保費</a></li>\
								<li><a href="../國民年金保險費/P1.html">國民年金保險費</a></li>\
								<li><a href="../新制勞工退休金/P1.html">新制勞工退休金</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">學雜費</p>\
							<ul class="third-menu-list">\
								<li><a href="../學雜費/P1.html">學雜費</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">繳費</p>\
							<ul class="third-menu-list">\
								<li><a href="../繳納期貨保證金/P1.html">期貨保證金</a></li>\
								<li><a href="../繳費/P1.html">繳費</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">自動扣繳服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../其他費用代扣繳取消/P1.html">自動扣繳查詢/取消</a></li>\
								<li><a href="../電費代扣繳申請/P1.html">臺灣電力公司</a></li>\
								<li><a href="../臺灣省水費代扣繳申請/P1.html">臺灣自來水公司</a></li>\
								<li><a href="../臺北市水費代扣繳申請/P1.html">臺北自來水事業處</a></li>\
								<li><a href="../中華電信電信費代扣繳申請/P1.html">中華電信費</a></li>\
								<li><a href="../健保費代扣繳申請/P1.html">健保費</a></li>\
								<li><a href="../勞保費用代扣繳申請/P1.html">勞保費</a></li>\
								<li><a href="../新制勞工退休提繳費/P1.html">新制勞工退休金</a></li>\
								<li><a href="../舊制勞工退休提繳費/P1.html">舊制勞工退休金</a></li>\
                                    <li><a href="../停車費代扣繳申請/P1.html">停車費代扣繳申請/取消</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-06" aria-labelledby="main-fuct-06" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">貸款查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../借款明細查詢/P1.html">借款明細查詢</a></li>\
								<li><a href="../下期借款本息查詢/P1.html">下期貸款本息查詢</a></li>\
								<li><a href="../已繳款本息查詢/P1.html">已繳款本息查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">房屋擔保借款</p>\
							<ul class="third-menu-list">\
								<li><a href="../房屋擔保借款繳息清單/P1.html">繳息清單</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-07" aria-labelledby="main-fuct-07" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">基金查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../基金餘額及損益查詢/P1.html">基金餘額/損益查詢</a></li>\
								<li><a href="../基金交易資料查詢/P1.html">基金交易明細查詢</a></li>\
								<li><a href="../定期投資約定資料查詢/P1.html">定期投資約定資料查詢</a></li>\
								<li><a href="../國內基金淨值查詢/P1.html">國內基金淨值查詢</a></li>\
								<li><a href="../國外基金淨值查詢/P1.html">國外基金淨值查詢</a></li>\
								<li><a href="../信託契約查詢/P1.html">信託契約書查詢</a></li>\
								<li><a href="../預約交易查詢取消/P0.html">預約查詢/取消</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">基金交易</p>\
							<ul class="third-menu-list">\
								<li><a  onclick="checkTime(singlePurchase,15,0)" href="#">單筆申購</a></li>\
								<li><a href="../定期投資申購/P1.html">定期投資申購</a></li>\
								<li><a href="../轉換交易/P1.html">轉換交易</a></li>\
								<li><a href="../贖回交易/P1.html">贖回交易</a></li>\
								<li><a href="../定期投資約定變更/P1.html">定期投資約定變更</a></li>\
								<li><a href="../停損停利通知設定/P1.html">停損/停利通知設定</a></li>\
								<li><a href="../SMARTFUND自動贖回設定/P1.html">SMART FUND自動贖回設定</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">債券查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../海外債券餘額及損益查詢/P1.html">海外債券餘額/損益查詢</a></li>\
								<li><a href="../海外債券資料查詢/P1.html">海外債券交易明細查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">投資適性評估 (KYC)</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上客戶投資屬性問卷調查表自然人版/P1.html">投資適性評估調查表</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">電子對帳單</p>\
							<ul class="third-menu-list">\
								<li><a href="../電子帳單申請/P1.html">電子對帳單申請</a></li>\
								<li><a href="../密碼重置/P1.html">密碼重置</a></li>\
								<li><a href="../電子帳單密碼變更/P1.html">密碼變更</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">境外信託商品</p>\
							<ul class="third-menu-list">\
								<li><a href="../境外信託商品推介同意書/P1.html">商品推介申請</a></li>\
								<li><a href="../終止境外信託商品推介聲明書/P1.html">商品推介終止</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">待確認交易</p>\
							<ul class="third-menu-list">\
								<li><a href="../行動理專待確認交易/快速交易.html">快速交易</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-08" aria-labelledby="main-fuct-08" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">查詢服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../黃金存摺餘額查詢/P1.html">黃金存摺餘額查詢</a></li>\
								<li><a href="../黃金存摺明細查詢/P1.html">黃金存摺明細查詢</a></li>\
								<li><a href="../當日黃金存摺價格查詢/P1.html">當日價格查詢</a></li>\
								<li><a href="../歷史黃金存摺價格查詢/P1.html">歷史價格查詢</a></li>\
								<li><a href="../預約黃金交易查詢取消/P1.html">預約取消/查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">黃金交易</p>\
							<ul class="third-menu-list">\
								<li><a href="../黃金買進/P1.html">黃金申購</a></li>\
								<li><a href="../黃金回售/P1.html">黃金回售</a></li>\
								<li><a href="../繳納定期扣款失敗手續費/P1.html">繳納定期扣款失敗手續費</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">定期定額交易</p>\
							<ul class="third-menu-list">\
								<li><a href="../黃金定期定額申購/P1.html">定期定額申購</a></li>\
								<li><a href="../定期定額變更/P1.html">定期定額變更</a></li>\
								<li><a href="../定期定額查詢/P1.html">定期定額查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">黃金存摺帳戶</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上申請黃金存摺帳戶/P1.html">黃金存摺帳戶申請</a></li>\
								<li><a href="../線上申請黃金存摺網路交易/P1.html">黃金存摺網路交易申請</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">投資適性評估(KYC)</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上客戶投資屬性問卷調查表自然人版/P1.html">投資適性評估調查表</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-09" aria-labelledby="main-fuct-09" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">申請信用卡</p>\
							<ul class="third-menu-list">\
								<li><a href="../申請信用卡進度查詢/P1.html">申請進度查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">帳務查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../信用卡持卡總覽/P1.html">信用卡持卡總覽</a></li>\
								<li><a href="../歷史帳單明細查詢/P1.html">歷史帳單明細查詢</a></li>\
								<li><a href="../信用卡未出帳單交易明細查詢/P1.html">未出帳單明細查詢</a></li>\
								<li><a href="../繳款紀錄查詢/P1.html">繳款紀錄查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">繳信用卡費</p>\
							<ul class="third-menu-list">\
								<li><a href="../繳納本行信用卡款/P1.html">繳本行信用卡費</a></li>\
								<li><a href="../信用卡款自動扣款申請取消/P1.html">自動扣款申請/取消</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">電子對帳單</p>\
							<ul class="third-menu-list">\
								<li><a href="../電子帳單申請/P1.html">電子對帳單申請</a></li>\
								<li><a href="../密碼重置/P1.html">密碼重置</a></li>\
								<li><a href="../電子帳單密碼變更/P1.html">密碼變更</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">實體對帳單</p>\
							<ul class="third-menu-list">\
								<li><a href="../申請補印帳單/P1.html">實體對帳單補寄</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">信用卡服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../信用卡開卡/P1.html">信用卡開卡</a></li>\
								<li><a href="../掛失服務/P35.html">信用卡掛失</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">預借現金</p>\
							<ul class="third-menu-list">\
								<li><a href="../申請補寄預借現金密碼/P1.html">密碼函補寄</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">信用卡分期服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../簽署信用卡來電分期專案申請書約款/P1.html">線上簽署信用卡來電分期專案申請書約款</a></li>\
								<li><a href="../長期使用循環信用申請分期還款/P1.html">長期使用循環信用申請分期還款</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-10" aria-labelledby="main-fuct-10" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
					<div class="sec-menu-item">\
							<p class="sec-menu-title">行動銀行服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上啟用行動銀行服務/P1.html">啟用行動銀行服務</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">約定轉入帳號服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上約定轉入帳號/P1.html">約定轉入帳號設定</a></li>\
								<li><a href="../取消約定轉入帳號/P1.html">約定轉入帳號取消</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">電子對帳單</p>\
							<ul class="third-menu-list">\
								<li><a href="../電子帳單申請/P1.html">電子對帳單申請</a></li>\
								<li><a href="../密碼重置/P1.html">密碼重置</a></li>\
								<li><a href="../電子帳單密碼變更/P1.html">密碼變更</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">存款餘額證明</p>\
							<ul class="third-menu-list">\
								<li><a href="../存款餘額證明申請/P1.html">存款餘額證明申請</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">票據服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../支票存款開戶申請/P1.html">支票存款開戶申請</a></li>\
								<li><a href="../空白票據申請/P1.html">空白票據</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">信用卡服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../申請信用卡進度查詢/P1.html">申請信用卡進度查詢</a></li>\
								<li><a href="../簽署信用卡來電分期專案申請書約款/P1.html">線上簽署信用卡來電分期專案申請書約款</a></li>\
								<li><a href="../長期使用循環信用申請分期還款/P1.html">長期使用循環信用申請分期還款</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">基金服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../預約開立基金戶/P1.html">預約開立基金戶</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">投資屬性評估(KYC評估)</p>\
							<ul class="third-menu-list">\
								<li><a href="../線上客戶投資屬性問卷調查表自然人版/P1.html">投資適性評估調查表</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">境外信託商品</p>\
							<ul class="third-menu-list">\
								<li><a href="../境外信託商品推介同意書/P1.html">商品推介申請</a></li>\
								<li><a href="../終止境外信託商品推介聲明書/P1.html">商品推介終止</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">隨護神盾</p>\
							<ul class="third-menu-list">\
								<li><a href="../隨護神盾申請/P1.html">申請隨護神盾</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">理財試算服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../臺幣定期存款試算/P1.html">臺幣定期存款試算</a></li>\
								<li><a href="../臺幣定期儲蓄存款試算/P1.html">臺幣定期儲蓄存款試算</a></li>\
								<li><a href="../外匯定期存款利息試算/P1.html">外匯定期存款利息試算</a></li>\
								<li><a href="../貸款攤還試算/P1.html">貸款攤還試算</a></li>\
								<li><a href="../年金計畫試算/P1.html">年金計算試算</a></li>\
								<li><a href="../定期定額投資試算/P1.html">定期定額投資試算</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">IDGATE</p>\
							<ul class="third-menu-list">\
								<li><a href="../IDGATE/P1.html">IDGATE</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-11" aria-labelledby="main-fuct-11" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">帳戶總覽設定</p>\
							<ul class="third-menu-list">\
								<li><a href="../帳戶總覽設定/P1.html">帳戶總覽設定</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">帳戶設定</p>\
							<ul class="third-menu-list">\
								<li><a href="../常用帳號設定/P1.html">常用帳號設定</a></li>\
								<li><a href="../使用者名稱變更/P1.html">使用者名稱變更</a></li>\
								<li><a href="../密碼變更/P1.html">密碼變更</a></li>\
								<li><a href="../重設交易密碼/P1.html">重設交易密碼</a></li>\
								<li><a href="../網路銀行交易密碼線上解鎖/P1.html">網路銀行交易密碼線上解鎖</a></li>\
								<li><a href="../Email設定/P1.html">Email設定</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">通訊資料變更</p>\
							<ul class="third-menu-list">\
								<li><a href="../變更通訊地址電話/P1.html">往來帳戶及信託業務通訊地址/電話變更</a></li>\
								<li><a href="../變更外匯進口出口匯兌通訊地址電話/P1.html">外匯進口/出口/匯兌通訊地址/電話變更</a></li>\
								<li><a href="../變更信用卡帳單地址電話/P1.html">信用卡帳單地址/電話變更</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">通知服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../通知服務/P1.html">通知服務設定</a></li>\
								<li><a href="../國內臺幣匯入匯款通知設定/P1.html">國內台幣匯入匯款通知設定</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">掛失/結清銷戶</p>\
							<ul class="third-menu-list">\
								<li><a href="../掛失服務/P1.html">掛失服務</a></li>\
								<li><a href="../線上申請新臺幣存款帳戶結清銷戶/P1.html">台幣存款帳戶結清銷戶申請</a></li>\
								<li><a href="../線上申請外匯帳戶存款結清銷戶/P1.html">外匯存款帳戶結清銷戶申請</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">扣繳憑單</p>\
							<ul class="third-menu-list">\
								<li><a href="../各類所得扣繳憑單列印/P1.html">各類所得扣繳憑單列印</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">通知服務</p>\
							<ul class="third-menu-list">\
								<li><a href="../通知服務/提醒通知訊息匣.html">提醒通知訊息匣</a></li>\
								<li><a href="../通知服務/存款帳務異動通知.html">存款帳務異動通知</a></li>\
								<li><a href="../通知服務/投資商品通知.html">投資商品通知</a></li>\
								<li><a href="../通知服務/信用卡訊息通知.html">信用卡訊息通知</a></li>\
								<li><a href="../通知服務/到價通知設定.html">到價通知設定</a></li>\
								<li><a href="../通知服務/智慧通知提醒.html">智慧通知提醒</a></li>\
								<li><a href="../通知服務/業務通知提醒.html">業務通知提醒</a></li>\
								<li><a href="../通知服務/優惠訊息設定.html">優惠訊息設定</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-12" aria-labelledby="main-fuct-12" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">保單查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../保單查詢/保單查詢.html">保單查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">網路投保</p>\
							<ul class="third-menu-list">\
								<li><a href="../網路投保/註冊會員P1.html">註冊會員</a></li>\
								<li><a href="../網路投保/會員資料查詢.html">會員資料查詢</a></li>\
								<li><a href="../網路投保/網路投保P1.html">網路投保</a></li>\
								<li><a href="../網路投保/保單進度查詢P1.html">保單進度查詢</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
				<div class="sec-menu collapse" id="main-fuct-12" aria-labelledby="main-fuct-12" data-parent="#ttb-sec-menu">\
					<div class="sec-menu-list">\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">保單查詢</p>\
							<ul class="third-menu-list">\
								<li><a href="../保單查詢/保單查詢.html">保單查詢</a></li>\
							</ul>\
						</div>\
						<div class="sec-menu-item">\
							<p class="sec-menu-title">網路投保</p>\
							<ul class="third-menu-list">\
								<li><a href="../網路投保/註冊會員P1.html">註冊會員</a></li>\
								<li><a href="../網路投保/會員資料查詢.html">會員資料查詢</a></li>\
								<li><a href="../網路投保/網路投保P1.html">網路投保</a></li>\
								<li><a href="../網路投保/保單進度查詢P1.html">保單進度查詢</a></li>\
							</ul>\
						</div>\
					</div>\
				</div>\
			</nav>\
		</div>\
    </nav>';
document.write(header);
