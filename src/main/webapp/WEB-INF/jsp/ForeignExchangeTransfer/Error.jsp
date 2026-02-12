<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>

<head>
	<script src="${pageContext.request.contextPath}/js/jquery-4.0.0.min.js"></script>
	<meta charset="UTF-8">
	<title>交易失敗</title> <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
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
	<script src="../scripts/menu.js"></script>
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
				
				<div class="main-content-block row">
					<div class="col-12 tab-content">
						
						<div class="ttb-input-block" style="text-align: center; padding: 60px 20px;">
							
							<h3 style="color: #333; margin-bottom: 30px; font-weight: normal;">
                                交易失敗
                            </h3>

							<div style="font-size: 1.6rem; color: #d9534f; font-weight: bold; margin-bottom: 15px;">
                                ${errorMessage}
                            </div>

							<div style="font-size: 1rem; color: #888; margin-bottom: 40px;">
                                錯誤代碼：${errorCode}
                            </div>
							
							<div style="text-align: center;">
								<a href="${pageContext.request.contextPath}/ForeignExchangeTransfer/init-p2" 
								   class="ttb-button btn-flat-orange" 
								   style="text-decoration:none; line-height: 40px; display:inline-block; width: 200px;">
									返回重新交易
								</a>
							</div>

						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
	
	<script src="../scripts/footer.js"></script>
</body>
</html>