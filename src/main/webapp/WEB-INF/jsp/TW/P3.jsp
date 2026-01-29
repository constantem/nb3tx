<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>臺幣轉帳</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	<meta itemprop="image" content="">
	<!-- import reset -->
	<link rel="stylesheet" href="../css/reset.css">
	<!-- import bootstrap -->
	<link rel="stylesheet" href="../bootstrap/bootstrap.min.css">
	<!-- import fontawesome -->
	<link rel="stylesheet" href="../fontawesome/css/all.css">
	<!-- import font family -->
	<link rel="stylesheet" href="../css/fonts.css">
	<!-- import tbb_CSS -->
	<link rel="stylesheet" href="../css/tbb_common.css">
	<!-- import animated hamburgers css -->
	<link href="../hamburgers-master/dist/hamburgers.css" rel="stylesheet">
	<!-- import jquery-->
	<script type="text/javascript" src="../scripts/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="../scripts/popper.min.js"></script>
	<!-- import bootstrap-->
	<script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
	<script type="text/javascript" src="../scripts/tbb_commit.js"></script>
	<script src="../scripts/menu.js"></script>
	<script>
		$(document).ready(function () {
			errorBlock("標題",null,["內容"],"按鈕",null); 
		});
	</script>
</head>

<body>
	<!-- import header and menu -->
	<script src="../scripts/header.js"></script>
	<script src="../scripts/nav.js"></script>
	<!-- breadcrumb.jsp -->
	<nav id="header-breadcrumb-nav" aria-label="breadcrumb">
		<ol class="ttb-breadcrumb">
			<li class="ttb-breadcrumb-item"><a href="#"><i class="fa fa-home"></i></a></li>
			<li class="ttb-breadcrumb-item"><a href="#">臺幣服務</a></li>
			<li class="ttb-breadcrumb-item active" aria-current="page">臺幣轉帳</li>
		</ol>
	</nav>
	<div class="content row">
		<section id="id-and-fast">
			<span class="id-name">親愛的 陳米米，您好！</span>
			<div id="id-block">
				<div>
					<span class="id-time">2017/12/26(二)16:23:36 登入成功</span>
					<span class="id-time">自動登出倒數<span class="high-light ml-1">07:00</span></span>
				</div>
				<button type="button" class="btn-flat-orange">重新計時</button>
				<button type="button" class="btn-flat-darkgray">登出</button>
			</div>
		</section>
		<main class="col-12"> <!-- 		主頁內容  -->
			<section id="main-content" class="container">

				<h2>
					轉帳交易
				</h2>
				<i class="fa fa-star" style="font-size: 1.5rem; color: rgb(237, 109, 0); display: none;"></i>

				<div id="step-bar">
					<ul>
						<li class="finished">輸入資料</li>
						<li class="finished">確認資料</li>
						<li class="active">交易完成</li>
					</ul>
				</div>

				<div class="main-content-block row">
					<div class="col-12 tab-content">
						<div class="ttb-input-block">
							<div class="ttb-message">
								<span> 轉帳成功 </span>
							</div>



							<div class="ttb-input-item row">
							<span class="input-title"><label>
									<h4>
										交易時間
									</h4>
							</label></span> <span class="input-block"><div class="ttb-input">
									<span> 2020/11/02 09:26:25 </span>
								</div></span>
							</div>

							<!--                         預約才有轉帳日期 -->
							<div class="ttb-input-item row">
							<span class="input-title"><label>
									<h4>
										轉出帳號
									</h4>
							</label></span> <span class="input-block"><div class="ttb-input">
									<span>  
										0016299****  </span>
								</div></span>
							</div>

							<div class="ttb-input-item row">
							<span class="input-title"><label>
									<h4>
										轉入帳號
									</h4>
							</label></span> <span class="input-block"><div class="ttb-input">
									<span> 0016277**** </span>
								</div></span>
							</div>

							<div class="ttb-input-item row">
							<span class="input-title"><label>
									<h4>
										轉帳金額
									</h4>
							</label></span> <span class="input-block"><div class="ttb-input">
									<span> <span class="input-unit">新臺幣</span> 1,000.00 <span class="input-unit">元</span>
									</span>
								</div></span>
							</div>

							<!--即時轉帳才顯示以下欄位 -->
							<div class="ttb-input-item row">
									<span class="input-title">
										<label>
												<h4>
													轉出帳號帳戶餘額
												</h4>
										</label>
									</span>
								<span class="input-block">
										<div class="ttb-input">
												<span> 新臺幣
													194,404,054.00 元
												</span>
										</div>
										</span>
							</div>

						</div><!-- 					ttb-input-block END -->
					</div><!-- 				col-12 tab-content END -->
				</div><!-- 			main-content-block row  END-->
				<ol class="description-list list-decimal">
					<p>說明</p>
					<li>晶片金融卡:為保護您的交易安全，結束交易或離開電腦時，請務必將晶片金融卡抽離讀卡機並登出系統。</li>
					<li>電子簽章:為保護您的交易安全，結束交易或離開電腦時，請務必將電子簽章(載具i-key)拔除並登出系統。</li>
				</ol>

			</section><!-- 		main-content END -->

		</main>
	</div>
	<nav id="footer-breadcrumb-nav">
		<ul>
			<li><a href="#">&nbsp</a></li>
			<li class="top-btn"><button title="Go to top"><img src="../img/top.svg" /></button></li>
		</ul>
	</nav>
	<script src="../scripts/footer.js"></script>
	<section id="error-block" class="error-block" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
    <div class="error-for-message" style="background:#fff; padding:30px; border-radius:10px; min-width:280px; max-width:90%; text-align:center;">
        <h3 id="error-title" class="error-title" style="margin-bottom:20px; color:#333;"></h3>
        <p id="error-content0" class="error-content" style="margin:10px 0;"></p>
        <p id="error-info0" class="error-info" style="margin:10px 0; font-weight:bold;"></p>
        
        <div style="margin-top:25px;">
            <button id="errorBtn1" class="btn-flat-orange ttb-pup-btn" style="padding:10px 30px; border:none; background:#ff8c00; color:#fff; border-radius:5px; cursor:pointer;"></button>
            <button id="errorBtn2" class="btn-flat-orange ttb-pup-btn" style="padding:10px 30px; border:none; background:#ccc; color:#fff; border-radius:5px; cursor:pointer; margin-left:10px;"></button>
        </div>
    </div>
</section>
</body>

</html>
