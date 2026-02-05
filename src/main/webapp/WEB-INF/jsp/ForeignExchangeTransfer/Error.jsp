<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>交易失敗</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/tbb_common.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/bootstrap/bootstrap.min.css">
</head>
<body>
    <div class="container" style="margin-top: 50px; text-align: center;">
        
        <div style="font-size: 5rem; color: red;">
            <i class="fas fa-times-circle"></i> 
        </div>

        <h2 style="color: red; font-weight: bold; margin-top: 20px;">交易失敗</h2>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #fff0f0; border: 1px solid #ffcccc; border-radius: 10px; display: inline-block;">
            
            <h4>錯誤代碼：<strong>${errorCode}</strong></h4>
            <h4>錯誤訊息：<strong>${errorMessage}</strong></h4>
            
        </div>
        
        <div style="margin-top: 40px;">
            <a href="${pageContext.request.contextPath}/ForeignExchangeTransfer/init-p2" class="btn btn-primary">
                重新交易
            </a>
        </div>
        
    </div>
</body>
</html>