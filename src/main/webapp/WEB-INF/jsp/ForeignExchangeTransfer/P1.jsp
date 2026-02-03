<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<script src="${pageContext.request.contextPath}/js/jquery-4.0.0.min.js"></script>
	<script>
	$(document).ready(function () {
	    $("#btnconfirm").click(function() {
	    	window.location.href = "${pageContext.request.contextPath}/ForeignExchangeTransfer/init-p2";
	    });
	});
	</script>
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
					<span class="id-time">2026/01/26(一)16:23:36 登入成功</span>
					<span class="id-time">自動登出倒數<span class="high-light ml-1">07:00</span></span>
				</div>
				<button type="button" class="btn-flat-orange">重新計時</button>
				<button type="button" class="btn-flat-darkgray" onclick="location.href='../html/Login.html'">登出</button>
			</div>
		</section>

		<main class="col-12">
			<section id="main-content" class="container">
				<h2>買賣外幣/約定轉帳</h2><i class="fas fa-star" style="font-size: 1.5rem; color: #ed6d00;"></i>
				<div class="main-content-block row">
					<div class="col-12">

						<div>
							<div class="ttb-message">
								<p>客戶辦理網路銀行外匯結構及轉帳、匯出匯款及匯入匯款解款應注意事項</p>
							</div>
							<ul class="ttb-result-list terms">
								<li data-num="">
									<ul class="">
										<li>
											<strong style="font-size:15px">
												1.本網路銀行
												<font color="red">
													不提供需檢附核准函或交易文件之各項外匯服務
												</font>
												，如申報義務人備有核准函或欲執行須檢附交易文件之外匯服務請臨櫃辦理。
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												2.本網路銀行
												<font color="red">
													涉及新台幣之外匯業務
												</font>
												僅提供
												<font color="red">
													未達等值新台幣50萬元以下之轉帳、匯出匯款及匯入匯款解款交易
												</font>
												。如超過交易限額請臨櫃辦理。
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												3.<font color="red">個人涉及人民幣之結購(含幣轉)及結售(含幣轉)亦應個別累計不得逾2萬元人民幣。</font>
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												4.<font color="red">如單筆交易或累計已達等值新台幣50萬元者，則該筆交易取消。</font>
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												5.本網路銀行
												<font color="red">未涉及新台幣之外匯業務</font>
												，其每筆或每日交易限額
												<font color="red">依本行網路銀行服務系統作業程序有關交易限額之規定辦理</font>
												。（參看本行網站重要公告內容）
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												6.申報義務人之外匯收支或交易未辦理新台幣結匯者，以本行掣發之其它交易憑證視同申報書。
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												7.申報義務人利用網際網路辦理新台幣結匯申報，經查獲有申報不實情形者，其日後辦理新台幣結匯申報事宜，應臨櫃辦理。
											</strong>
										</li>
										<li>
											<strong style="font-size:15px">
												8.本網路銀行提供之匯入匯款解款交易，倘因貴行有錯付或產生任何糾紛，對於匯入款項及可能衍生之利息，本人（公司）願負返還之責任。
											</strong>
										</li>
									</ul>
								</li>
							</ul>
						</div>
						<input type="button" id="btnconfirm" class="ttb-button btn-flat-orange"  value="確定">
					</div>
				</div>
			</section>
		</main>


	</div>
	<script src="../scripts/footer.js"></script>


</body>

</html>