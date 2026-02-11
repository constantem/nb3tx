<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<jsp:useBean id="now" class="java.util.Date" />

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>臺幣轉帳 - 確認</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" href="../css/reset.css" />
    <link rel="stylesheet" href="../bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="../fontawesome/css/all.css" />
    <link rel="stylesheet" href="../css/fonts.css" />
    <link rel="stylesheet" href="../css/tbb_common.css" />
    <link href="../hamburgers-master/dist/hamburgers.css" rel="stylesheet" />
    
    <script type="text/javascript" src="../scripts/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="../scripts/popper.min.js"></script>
    <script type="text/javascript" src="../bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="../scripts/tbb_commit.js"></script>
    <script src="../scripts/menu.js"></script>
    <script src="../scripts/fstop.js"></script>
    
    <script>
      $(document).ready(function () {
        
        // [確定] 按鈕事件
        $("#btnNext2").click(function () {
            // 1. 取得密碼
            var pin = $("input[name='pinnew']").val();

            // 2. 檢核是否為空
            if (!pin || pin.trim() === "") {
                // 顯示 Error Block
                $("#error-title").text("提醒");
                $("#error-content0").text("請完成所有必填欄位 (交易密碼)");
                $("#error-block").css("display", "flex");
                return; // 阻止送出
            }

            // 3. 送出表單
            $("#confirmForm").submit();
        });

        // [回上頁] 按鈕事件
        $("#btnBack").click(function(){
            window.history.back();
        });

      });
    </script>
  </head>

  <body>
    <script src="../scripts/header.js"></script>
    <script src="../scripts/nav.js"></script>
    
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
            <span class="id-time">
                <fmt:setLocale value="zh_TW" />
                <fmt:formatDate value="${now}" pattern="yyyy/MM/dd(E)HH:mm:ss" /> 登入成功
            </span>
            <span class="id-time">自動登出倒數<span class="high-light ml-1">07:00</span></span>
          </div>
          <button type="button" class="btn-flat-orange">重新計時</button>
          <button type="button" class="btn-flat-darkgray">登出</button>
        </div>
      </section>
      
      <main class="col-12">
        <section id="main-content" class="container">

            <h2>轉帳交易</h2>
            <i class="fa fa-star-o" style="font-size: 1.5rem; color: rgb(237, 109, 0); display: inline;"></i>

            <div id="step-bar">
              <ul>
                <li class="finished">輸入資料</li>
                <li class="active">確認資料</li>
                <li class="">交易完成</li>
              </ul>
            </div>

            <div class="main-content-block row radius-50">
              <nav style="width: 95%">
              </nav>

              <div class="col-12 tab-content" id="nav-tabContent">
                <div class="tab-pane fade" id="nav-trans-future" role="tabpanel" aria-labelledby="nav-profile-tab"></div>

                <div class="ttb-input-block tab-pane fade show active" id="nav-trans-now" role="tabpanel" aria-labelledby="nav-home-tab">
                  
                  <form id="confirmForm" action="${pageContext.request.contextPath}/TwdTransfer/do-transfer" method="post" style="width:100%">
                  
                  <input type="hidden" name="fromAcct" value="${fromAcct}">
                  <input type="hidden" name="toBankCode" value="${toBank}"> 
                  <input type="hidden" name="toAcct" value="${toAcct}">
                  <input type="hidden" name="amount" value="${amount}">

                  <div class="ttb-message">
                    <p>即時</p>
                    <span>請確認轉帳資料</span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉帳日期</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <span><fmt:formatDate value="${now}" pattern="yyyy/MM/dd" /></span>
                      </div>
                    </span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉出帳號</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <c:set var="lenFrom" value="${fn:length(fromAcct)}" />
                        <c:choose>
                            <c:when test="${lenFrom > 4}">
                                <span>${fn:substring(fromAcct, 0, lenFrom - 4)}****</span>
                            </c:when>
                            <c:otherwise>
                                <span>${fromAcct}</span>
                            </c:otherwise>
                        </c:choose>
                      </div>
                    </span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉入帳號</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <span>${toBank}-${toBankName} </span>
                        <c:set var="lenTo" value="${fn:length(toAcct)}" />
                        <c:choose>
                            <c:when test="${lenTo > 4}">
                                <span>${fn:substring(toAcct, 0, lenTo - 4)}****</span>
                            </c:when>
                            <c:otherwise>
                                <span>${toAcct}</span>
                            </c:otherwise>
                        </c:choose>
                      </div>
                    </span>
                  </div>
                  
                  <div class="ttb-input-item row">
								<span class="input-title">
									<label>
										<h4>轉入帳號確認</h4>
									</label>
								</span>
								<span class="input-block">
									<div class="ttb-input">
										<img src="../img/getBHO.jpg">
										<br>
										<br>
									</div>
									<div class="BHOInput">
										<input type="text" maxlength="1" class="text-input" value="8">
										-
										<input type="text" maxlength="1" class="text-input" value="0">
										-
										<input type="text" maxlength="1" class="text-input" value="1">
										<span class="input-unit">
											(請以半型字輸入黃色標記之轉入帳號數字)
										</span>
									</div>
								</span>
							</div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉帳金額</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <p class="high-light">
                          <span class="input-unit">新臺幣</span>
                          <fmt:formatNumber value="${amount}" type="number" pattern="#,###" />
                          <span class="input-unit">元</span>
                        </p>
                      </div>
                    </span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>交易機制</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <label class="radio-block">
                          交易密碼(SSL)
                          <input type="radio" value="0" checked="checked">
                          <span class="ttb-radio"></span>
                        </label>
                        <div class="ttb-input" name="pw_group">
                          <input type="password" name="pinnew" class="text-input" maxlength="8" placeholder="請輸入密碼">
                        </div>
                      </div>
                    </span>
                  </div>
                  
                  <div style="margin-top: 30px; text-align:center;">
                      <input type="button" id="btnBack" class="ttb-button btn-flat-gray" value="回上頁">
                      <input type="button" id="btnNext2" class="ttb-button btn-flat-orange" value="確定">
                  </div>

                  </form>
                </div>
              </div>
            </div>
        </section>
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
                <button onclick="$('#error-block').hide()" class="btn-flat-orange ttb-pup-btn" style="padding:10px 30px; border:none; background:#ff8c00; color:#fff; border-radius:5px; cursor:pointer;">關閉</button>
            </div>
        </div>
    </section>
  </body>
</html>