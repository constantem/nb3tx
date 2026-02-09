<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>

<head>
	<script src="${pageContext.request.contextPath}/js/jquery-4.0.0.min.js"></script>
	
	<textarea id="fxDataRaw" style="display:none;">${fxBalancesJson}</textarea>

	<script>
	    var fxData = {};
	
	    $(document).ready(function () {
	        console.log(">>> JS 啟動...");
	        
	        setTimeout("initBlockUI()", 50);
	        setTimeout("init()", 400);
	        setTimeout("unBlockUI(initBlockId)", 500);
	
	        try {
	            var rawJson = $("#fxDataRaw").val();
	            if (rawJson && rawJson.trim() !== "") {
	                fxData = JSON.parse(rawJson);
	                console.log(">>> 外幣餘額資料載入成功 (筆數: " + Object.keys(fxData).length + ")");
	            } else {
	                console.log(">>> 沒有外幣餘額資料");
	            }
	        } catch (e) {
	            console.error(">>> 解析 JSON 失敗:", e);
	        }

	        function updateBalance() {
	            var selectedAcct = $("#fromAccountSelect").val();
	            var selectedCurr = $("select[name='fromCurr']").val();
	            var balanceSpan = $("#balanceDisplay");
	            var currSpan = $("#currDisplay"); 
	            var amountLabel = $("#amountCurrLabel");

	            console.log(">>> 觸發更新: 帳號=" + selectedAcct + ", 幣別=" + selectedCurr);

	            if (!selectedAcct || selectedAcct === "" || selectedAcct.includes("請選擇")) {
	                balanceSpan.text("----");
	                currSpan.text("");
	                amountLabel.val("");
	                return;
	            }

	            balanceSpan.text("查詢中...");

	            if (fxData && fxData.hasOwnProperty(selectedAcct)) {
	                console.log("    -> 命中外幣帳號緩存");
	                currSpan.text(selectedCurr ? selectedCurr : "");
	                amountLabel.val(selectedCurr ? selectedCurr : "");
	                
	                if (selectedCurr && selectedCurr !== "") {
	                    var bal = fxData[selectedAcct][selectedCurr];
	                    if (bal !== undefined) {
	                        balanceSpan.text(bal); 
	                    } else {
	                        balanceSpan.text("0"); 
	                    }
	                } else {
	                    balanceSpan.text("請選擇幣別");
	                }

	            } else {
	                console.log("    -> 非外幣帳號，呼叫 AJAX N110");
	                currSpan.text("TWD"); 
	                amountLabel.val("TWD");
	                
	                $.ajax({
	                    url: "${pageContext.request.contextPath}/ForeignExchangeTransfer/query-balance",
	                    type: "POST",
	                    data: { acctNo: selectedAcct },
	                    success: function(balance) {
	                        balanceSpan.text(balance);
	                    },
	                    error: function() {
	                        balanceSpan.text("查詢失敗");
	                    }
	                });
	            }
	        }
	
	        $("#fromAccountSelect").off("change").on("change", updateBalance);
	        $("select[name='fromCurr']").off("change").on("change", updateBalance);
	    });
	
	    function init(){
	        console.log("init started");
	        $("#hideblock").hide();
	    }
	</script>

	<meta charset="UTF-8">
	<title>買賣外幣/約定轉帳</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
	
	<link rel="stylesheet" href="../css/reset.css">
	<link rel="stylesheet" href="../bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="../fontawesome/css/all.css">
	<link rel="stylesheet" href="../css/fonts.css">
	<link rel="stylesheet" type="text/css" href="../css/fixedColumns.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="../css/jquery.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="../css/jquery.datetimepicker.css">
	<link rel="stylesheet" href="../css/tbb_common.css">
	<link href="../hamburgers-master/dist/hamburgers.css" rel="stylesheet">

	<script type="text/javascript" src="../css/jquery-3.3.1.slim.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/jquery-3.3.1.js"></script>
	<script type="text/javascript" src="../css/popper.min.js"></script>
	<script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/jquery.dataTables.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/dataTables.fixedColumns.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/dataTables.rowsGroup.js"></script>
	<script src="../scripts/menu.js"></script>
	<script src="../scripts/jquery.validationEngine.js"></script>
	<script src="../scripts/jquery.validationEngine-zh_TW.js"></script>
	<script src="../scripts/jquery.datetimepicker.js"></script>
	<script src="../scripts/fstop.js"></script>
	<script src="../scripts/tbb_commit.js"></script>
</head>

<body>
	<script src="../scripts/header.js"></script>

	<nav id="header-breadcrumb-nav" aria-label="breadcrumb">
		<ol class="ttb-breadcrumb">
			<li class="ttb-breadcrumb-item"><a href="../html/登入後首頁.html"><i class="fa fa-home"></i></a></li>
			<li class="ttb-breadcrumb-item"><a href="#">外幣服務</a></li>
			<li class="ttb-breadcrumb-item active" aria-current="page">買賣外幣/約定轉帳</li>
		</ol>
	</nav>
	
	<div class="content row">
		<div class="d-lg-none header-container"></div>
		
		<section id="id-and-fast">
			<span class="id-name">親愛的 陳米漿，您好！</span>
			<div id="id-block">
				<div>
					<span class="id-time">2026/01/26(一)16:23:36 登入成功</span>
					<span class="id-time">自動登出倒數<span class="high-light ml-1">07:00</span></span>
				</div>
				<button type="button" class="btn-flat-orange">重新計時</button>
				<button type="button" class="btn-flat-darkgray" onclick="location.href='../html/Login.html'">登出</button>
			</div>
		</section>

		<main class="col-12"> 
			<section id="main-content" class="container">
				<h2>買賣外幣/約定轉帳</h2>
				<i class="fa fa-star" style="font-size: 1.5rem; color: rgb(237, 109, 0); display: none;"></i>
					
				<div class="main-content-block row radius-50">
					<nav style="width: 100%;">
						<div class="nav nav-tabs" id="nav-tab" role="tablist">
							<a class="nav-item nav-link active" id="nav-trans-now" data-toggle="tab" href="#nav-trans-now" role="tab" aria-controls="nav-home" aria-selected="false" >
								即時（當日AM9:10~PM15:30）
							</a> 
							<a class="nav-item nav-link" id="nav-trans-future" data-toggle="tab"  role="tab" aria-controls="nav-profile" aria-selected="true" >
								預約
							</a>
						</div>
					</nav>
					
					<div class="col-12 tab-content" id="nav-tabContent">
						<div class="tab-pane fade " id="nav-trans-future" role="tabpanel" aria-labelledby="nav-profile-tab"></div>
						
						<div class="ttb-input-block tab-pane fade show active" id="nav-trans-now" role="tabpanel" aria-labelledby="nav-home-tab">
						
							<form action="${pageContext.request.contextPath}/ForeignExchangeTransfer/step3-confirm" method="post">
						
								<div class="ttb-message">
									<span></span>
								</div>
								
								<div class="ttb-input" style="display: none;">
									<label class="radio-block">
										即時
										<input type="radio" name="FGTRDATE" value="0" checked=""> 
										<span class="ttb-radio"></span>
									</label>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title">
										<label><h4>轉出帳號</h4></label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<select class="custom-select multi-lang-select" name="fromAccount" id="fromAccountSelect">
												<option value="">---請選擇帳號---</option>
												
												<c:forEach var="acc" items="${accountList}">
													<option value="${acc.value}">${acc.text}</option>
												</c:forEach>
											</select>
										</div>
										
										<span class="input-unit">
											可用餘額:
											<span id="currDisplay" style="font-weight:bold;"></span>
   										 	<span id="balanceDisplay" style="color:red; font-weight:bold;">----</span>
										</span>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title">
										<label><h4>轉出幣別</h4></label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<select class="custom-select multi-lang-select" name="fromCurr">
												<option value="">---請選擇---</option>
												<c:forEach var="curr" items="${currencyList}">
													<option value="${curr.key}">${curr.value}</option>
												</c:forEach>
											</select>
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title">
										<label><h4>轉入帳號</h4></label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<select class="custom-select multi-lang-select" name="toAccount">
												<option value="">--請選擇約定帳號--</option>
												
												<c:forEach var="acc" items="${accountList}">
													<option value="${acc.value}">${acc.text}</option>
												</c:forEach>
											</select>
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title">
										<label><h4>轉入幣別</h4></label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<select class="custom-select multi-lang-select" name="toCurr">
												<option value="">---請選擇---</option>
												<c:forEach var="curr" items="${currencyList}">
													<option value="${curr.key}">${curr.value}</option>
												</c:forEach>
											</select>
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title">
										<label><h4>轉帳金額</h4></label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<input id="amountCurrLabel" class="text-input input-width-100" value="" disabled="">
											<input type="number" class="text-input input-width-125" name="amount" value="10">
										</div>
									</span>
								</div>
							
								<input type="hidden" name="password" value="147258" />
							
								<div class="row justify-content-center" style="margin-top: 20px; width: 100%;">
							        <input type="button" class="ttb-button btn-flat-gray" value="重新輸入" style="margin-right: 15px;">
							        <input type="submit" class="ttb-button btn-flat-orange" value="確定">
							    </div>
							
							</form>
						
						</div> 
					</div>
				</div>
				
				<ol class="description-list list-decimal">
					<p>說明</p>
						<li>查詢<a href="" target="_blank">「交易最高限額表」、</a><a href="" target="_blank">「交易手續費及相關優惠」、</a><a href="" target="_blank">「當日匯率查詢」。</a></li>
						<li>交易時間為銀行營業日9:10-15:30。</li>
						<li>外幣間轉帳依轉帳當日「幣別轉換匯率」承做。</li>
						<li>美金匯率以交易日小額掛牌承做，其他幣別依即期匯率承做。</li>
						<li>涉及新台幣兌換交易之匯率優惠，美金以小額掛牌優惠0.015；澳幣、歐元依即期掛牌優惠0.015，紐幣優惠0.01，南非幣優惠0.006，港幣優惠0.002，日幣優惠0.0002（惟不得優於本行成本匯率），如有變動，將於本網站公告。</li>
						<li>預約交易請於預約交易日之前一日，存足款項於轉出帳號備扣。預約交易將於交易日與外匯即時轉帳併計最高轉出限額。</li>
						<li>外匯預約交易可預約次日起1年內之交易。預約交易日如為曆法所無之日期，以該月之末日為交易日，如遇例假日/非銀行營業日，則順延至次一營業日。例如：預約交易日為6月31日，但6月無31日，故交易日為6月30日，又如6月30日為例假日則順延至7月1日。<span class="text-danger">惟如遇交易分行颱風天等天災則預約交易視為交易失敗。</span>。</li>
						<li>預約交易的匯率以交易日本行9:10牌告匯率為準。</li>
						<li>預約成功不代表交易已完成，請於轉帳日利用『預約交易結果查詢』，以確認交易結果。</li>
						<li>如欲取消預約，請於轉帳日之前1日辦理。交易密碼(SSL)預約交易，請以交易密碼(SSL)取消交易；電子簽章(i-key)預約交易，請以電子簽章(i-key)取消預約。</li>
						<li>單一客戶外匯存款幣轉及結購、結售交易每筆在等值新台幣1,000元以下者，同一日交易累計次數(含一般網路銀行、企業網路銀行、行動銀行及電話銀行)合計以20次為限。</li>
						<li>倘匯出匯款申報性質為280(對外融資貸款)/340(償還國外借款)，匯入匯款申報性質由系統自動申報為340(國外借款)/280(收回對外貸款)，以符合央行外匯收支或交易申報辦法之規範。</li>
						<li><span><font color="red">併行作業期間:倘您已曾經登入新版網路銀行後，前於舊版網銀已預約之轉帳交易，統一將移轉至新版網路銀行執行及查詢;另新、舊版網路銀行執行預約交易，需回原執行之網路銀行查詢，無法於兩系統間相互查詢。</font></span></li><!--併行作業期間:倘您已曾經登入新版網路銀行後，前於舊版網銀已預約之轉帳交易，統一將移轉至新版網路銀行執行及查詢;另新、舊版網路銀行執行預約交易，需回原執行之網路銀行查詢，無法於兩系統間相互查詢。 -->
				</ol>
			</section>
		</main>
	</div>

	<script src="../scripts/footer.js"></script>

	<section id="error-block" class="error-block" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
		<div class="error-for-message" style="background:#fff; padding:30px; border-radius:10px; min-width:280px; max-width:90%; text-align:center;">
			<h3 id="error-title" class="error-title" style="margin-bottom:20px; color:#333;"></h3>
			<p id="error-content0" class="error-content" style="margin:10px 0;"></p>
			<p id="error-info0" class="error-info" style="margin:10px 0; font-weight:bold;"></p>
			<div style="margin-top:25px;">
				<button id="errorBtn1" class="btn-flat-orange ttb-pup-btn"></button>
				<button id="errorBtn2" class="btn-flat-orange ttb-pup-btn"></button>
			</div>
		</div>
	</section>

</body>
</html>