<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>

<head>
	<script src="${pageContext.request.contextPath}/js/jquery-4.0.0.min.js"></script>
	<meta charset="UTF-8">
	<title>買賣外幣/約定轉帳 - 驗證</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	
	<link rel="stylesheet" href="../css/reset.css">
	<link rel="stylesheet" href="../bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="../fontawesome/css/all.css">
	<link rel="stylesheet" href="../css/fonts.css">
	<link rel="stylesheet" type="text/css" href="../css/fixedColumns.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="../css/jquery.dataTables.min.css">
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
	<script src="../scripts/tbb_commit.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			errorBlock('標題', null, ['內容'], '按鈕', null);
			
			var timeLeft = 180; 
			setInterval(function(){
				if(timeLeft > 0) {
					timeLeft--;
					$("#countDownSec").text(timeLeft);
				}
			}, 1000);
		});
	</script>

</head>

<body>
	<script src="../scripts/header.js"></script>
	<script src="../scripts/nav.js"></script>
	
	<nav id="header-breadcrumb-nav" aria-label="breadcrumb">
		<ol class="ttb-breadcrumb">
			<li class="ttb-breadcrumb-item"><a href="../html/登入後首頁.html"><i class="fa fa-home"></i></a></li>
			<li class="ttb-breadcrumb-item"><a href="#">外幣服務</a></li>
			<li class="ttb-breadcrumb-item active" aria-current="page">買賣外幣/約定轉帳</li>
		</ol>
	</nav>
	
	<div class="content row">
		<section id="id-and-fast">
			<span class="id-name">親愛的 陳米漿，您好！</span>
			<div id="id-block">
				<div>
					<span class="id-time">2026/01/26(二)16:23:36 登入成功</span>
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
				
				<form method="post" action="${pageContext.request.contextPath}/ForeignExchangeTransfer/do-confirm">
					
					<div class="main-content-block row">
						<div class="col-12 tab-content">
							<div class="ttb-input-block">
								<div class="ttb-message">
									<span>
										請確認轉帳資料,並於三分鐘內執行放行交易 - 時間：<font color="red" id="countDownSec">180</font> 秒
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>轉帳日期</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											<script>document.write(new Date().toISOString().slice(0, 10));</script>
										</div>
									</span>
								</div>
	
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>轉出帳號</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											${maskedFromAccount}
										</div>
									</span>
								</div>
							
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>轉出金額</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											${form.fromCurr} 
											${displayFromAmount}
											&nbsp;元
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>轉入帳號</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											${maskedToAccount}
										</div>
									</span>
								</div>
	
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>轉入帳號確認</h4></label></span> 
									<span class="input-block">
										<div class="ttb-input">
											<img src="../img/getBHO.jpg" alt="驗證碼圖片">
											<br><br>
										</div>
										<div class="BHOInput">
											<input type="text" class="text-input" size="3"> -
											<input type="text" class="text-input" size="3"> -
											<input type="text" class="text-input" size="3">
											<span class="input-unit">(請以半型字輸入黃色標記之轉入帳號數字)</span>
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>匯率</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											${form.rate}
										</div>
									</span>
								</div>
								
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>議價編號</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											${maskedQuoteId}
										</div>
									</span>
								</div>
	
								<div class="ttb-input-item row">
									<span class="input-title"><label><h4>交易機制</h4></label></span>
									<span class="input-block">
										<div class="ttb-input">
											<label class="radio-block"> 
												交易密碼(SSL) 
												<input type="radio" name="FGTXWAY" checked="checked" value="0"> 
												<span class="ttb-radio"></span>
											</label>
										</div>
										<div class="ttb-input">
											<input type="password" name="password" class="text-input" size="8" maxlength="8" placeholder="請輸入密碼" value="147258">
										</div>
									</span>
								</div>
							</div>
							
							<input type="hidden" name="fromAccount" value="${form.fromAccount}" />
							<input type="hidden" name="toAccount" value="${form.toAccount}" />
							<input type="hidden" name="amount" value="${form.amount}" />
							<input type="hidden" name="fromCurr" value="${form.fromCurr}" />
							<input type="hidden" name="toCurr" value="${form.toCurr}" />
							<input type="hidden" name="quoteId" value="${form.quoteId}" />
							<input type="hidden" name="rate" value="${form.rate}" />

							<input class="ttb-button btn-flat-gray" type="button" value="上一步" onclick="history.back()">
							
							<input class="ttb-button btn-flat-orange" type="submit" value="確定交易">
							
						</div>
					</div>
				</form>
				
				<ol class="description-list list-decimal">
					<p>說明</p>
					<li><strong style="font-weight: 400">本筆交易之承作匯率若偏離即時匯率，則交易失敗。</strong></li>
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