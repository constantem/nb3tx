<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:useBean id="now" class="java.util.Date" />

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>交易失敗</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="../fontawesome/css/all.css">
    <link rel="stylesheet" href="../css/fonts.css">
    <link rel="stylesheet" href="../css/tbb_common.css">
    <link href="../hamburgers-master/dist/hamburgers.css" rel="stylesheet">
    
    <script type="text/javascript" src="../scripts/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
    <script src="../scripts/menu.js"></script>
</head>

<body>
    <script src="../scripts/header.js"></script>
    <script src="../scripts/nav.js"></script>

    <div class="content row">
        <section id="id-and-fast">
            <span class="id-name">親愛的 陳米米，您好！</span>
            <div id="id-block">
                <button type="button" class="btn-flat-darkgray">登出</button>
            </div>
        </section>

        <main class="col-12">
            <section id="main-content" class="container">
                
                <h2>轉帳交易</h2>

                <div id="step-bar">
                    <ul>
                        <li class="finished">輸入資料</li>
                        <li class="finished">確認資料</li>
                        <li class="active">交易失敗</li>
                    </ul>
                </div>

                <div class="main-content-block row radius-50">
                    <div class="col-12 tab-content">
                        <div class="ttb-input-block" style="text-align: center; padding: 60px 20px;">
                            
                            <h3 style="color: #333; margin-bottom: 30px; font-weight: normal;">
                                交易失敗
                            </h3>

                            <div style="font-size: 1.6rem; color: #000; font-weight: bold; margin-bottom: 15px;">
                                ${errorMessage}
                            </div>

                            <div style="font-size: 1rem; color: #888;">
                                錯誤代碼：${errorCode}
                            </div>

                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${pageContext.request.contextPath}/TwdTransfer/init-p1" class="ttb-button btn-flat-orange" style="text-decoration:none; line-height: 40px; display:inline-block;">
                        返回交易首頁
                    </a>
                </div>

            </section>
        </main>
    </div>

    <script src="../scripts/footer.js"></script>
</body>
</html>