<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>買賣外幣/約定轉帳</title>
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
	<!-- import dataTables -->
	<link rel="stylesheet" type="text/css" href="../css/fixedColumns.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="../css/jquery.dataTables.min.css">
	<!-- import tbb_CSS -->
	<link rel="stylesheet" href="../css/tbb_common.css">
	<!-- import animated hamburgers css -->
	<link href="../hamburgers-master/dist/hamburgers.css" rel="stylesheet">


	<!-- import jquery-->
	<script type="text/javascript" src="../css/jquery-3.3.1.slim.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/jquery-3.3.1.js"></script>
	<script type="text/javascript" src="../css/popper.min.js"></script>
	<!-- import bootstrap-->
	<script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
	<!-- import dataTables js -->
	<script type="text/javascript" language="javascript" src="../css/jquery.dataTables.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/dataTables.fixedColumns.min.js"></script>
	<script type="text/javascript" language="javascript" src="../css/dataTables.rowsGroup.js"></script>
	<script type="text/javascript" language="javascript" src="../css/dataTables.rowsGroup.js"></script>
	<script src="../scripts/menu.js"></script>
	<script src="../scripts/tbb_commit.js"></script>
	<script type="text/javascript">
	
		$(document).ready(function() {
			    errorBlock(
        '標題', 
        null, 
        ['內容'], 
        '按鈕', 
        null
    );
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
				<!-- 外匯結購售/轉帳 -->
				<h2>
					買賣外幣/約定轉帳
				</h2>
				<i class="fa fa-star" style="font-size: 1.5rem; color: rgb(237, 109, 0); display: none;"></i>
				<form autocomplete="off" method="post" id="formId" action="/nb3/FCY/TRANSFER/f_transfer_r_confirm">
					<div class="main-content-block row">
						<div class="col-12 tab-content">
							<div class="ttb-input-block">
								<div class="ttb-message">
									<span>
										請確認匯率 -時間:<font id="CountDown" color="red">5</font> 秒
									</span>
								</div>
								<!-- 轉出金額 -->
								<div class="ttb-input-item row">
									<span class="input-title">
										<label>
											<h4>轉出金額</h4>
										</label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<p>
												<!-- 幣別 -->
												TWD 新臺幣
												<!-- 轉出金額  -->
												100.00
												&nbsp;元
											</p>
										</div>
									</span>
								</div>
								
								<!-- 轉入金額 -->
								<div class="ttb-input-item row">
									<span class="input-title">
										<label>
											<h4>轉入金額</h4>
										</label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<p>
												<!-- 幣別 -->
												USD 美金
												<!-- 轉入金額 -->
												3.45
												&nbsp;元
											</p>
										</div>
									</span>
								</div>
								
								<!-- 匯率 -->
								<div class="ttb-input-item row">
									<span class="input-title">
										<label>
											<h4>匯率</h4>
										</label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<p>
												28.99300000
											</p>
										</div>
									</span>
								</div>
								
								<!--議價編號 -->
								<div class="ttb-input-item row">
									<span class="input-title">
										<label>
											<h4>議價編號</h4>
										</label>
									</span>
									<span class="input-block">
										<div class="ttb-input">
											<p>
												S29FS0****
											</p>
										</div>
									</span>
								</div>
							</div>
							
							<input class="ttb-button btn-flat-gray" id="CMCANCEL" name="CMCANCEL" type="button" value="取消交易" onclick="cancelTran()">
							<input class="ttb-button btn-flat-orange" id="CMSUBMIT" name="CMSUBMIT" type="button" value="確定" onclick="location.href='P5.html'">
						</div>
					</div>
				</form>
			</section>
			<!-- main-content END -->
		</main>
	</div>
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
