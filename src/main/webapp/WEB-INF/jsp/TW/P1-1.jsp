<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:useBean id="now" class="java.util.Date" />

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>臺幣轉帳</title>
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
    
    <script>
      $(document).ready(function () {
        
        // 按鈕點擊事件
        $("#btnNext").click(function() {
            var fromAcct = $("#fromAcct").val();
            var amount = $("input[name='amount']").val();
            

            // 2. 判斷使用者選的是「約定」還是「非約定」
            var transferType = $("input[name='acctType']:checked").val(); 
            
            var finalBank = "";
            var finalAcct = "";

            if (transferType == "1") {
                // A. 約定帳號
                var selectedOption = $("#agreedSelect").find("option:selected");
                finalBank = selectedOption.attr("data-bank");
                finalAcct = selectedOption.val();
            } else {
                // B. 非約定帳號
                finalBank = $("select[name='toBank_manual']").val();
                finalAcct = $("input[name='toAcct_manual']").val();
            }

            // === 檢核邏輯開始 (請注意這裡順序) ===

            // 檢核 1: 必填欄位
            if (!fromAcct || fromAcct.trim() === "" || 
                !amount || amount.trim() === "" || 
                !finalAcct || finalAcct.trim() === "") {
                
                showError("提醒", "請完成所有必填欄位");
                return; // 阻止送出
            }

            // 檢核 2: 金額只能是數字 (這一步會擋下 "iii" 或 "ooo")
            var numRegex = /^[0-9]+$/;
            if (!numRegex.test(amount)) {
                showError("提醒", "轉帳金額僅能輸入數字");
                return; // 阻止送出
            }

            // 檢核 3: 轉出與轉入帳號不可相同
            if (fromAcct === finalAcct) {
                showError("提醒", "轉出帳號和轉入帳號不可相同！");
                return; // 阻止送出
            }

            // === 檢核通過，填入資料並送出 ===
            $("#finalToBank").val(finalBank);
            $("#finalToAcct").val(finalAcct);
            $("#transferForm").submit();
        });

        // ErrorBlock 關閉按鈕
        $("#errorBtn1, #errorBtn2").click(function() {
            $("#error-block").hide();
        });
      });

      // 顯示錯誤視窗函式
      function showError(title, content) {
          $("#error-title").text(title);
          $("#error-content0").text(content);
          $("#error-block").css("display", "flex"); // 顯示遮罩
      }
      
      // 更新餘額顯示
      function updateBalance(selectObj) {
          var selectedOption = selectObj.options[selectObj.selectedIndex];
          var balance = selectedOption.getAttribute("data-balance");
          
          if (!balance || balance === "undefined") balance = "0";
          
          // 加千分位並顯示小數點兩位 (模擬原始畫面格式)
          var formattedBal = parseFloat(balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          
          $("#displayBalance").text(formattedBal);
      }
    </script>
  </head>

  <body>
    <script src="../scripts/header.js"></script>
    <script src="../scripts/nav.js"></script>
    
    <nav id="header-breadcrumb-nav" aria-label="breadcrumb">
      <ol class="ttb-breadcrumb">
        <li class="ttb-breadcrumb-item">
          <i class="fa fa-home"></i>
        </li>
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
                <li class="active">輸入資料</li>
                <li class="">確認資料</li>
                <li class="">交易完成</li>
              </ul>
            </div>

            <div class="main-content-block row radius-50">
              <nav style="width: 100%">
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <a class="nav-item nav-link active" id="nav-trans-now" data-toggle="tab" href="#nav-trans-now" role="tab" aria-controls="nav-home" aria-selected="false">即時</a>
                  <a class="nav-item nav-link" id="nav-trans-future" data-toggle="tab" href="#" role="tab" aria-controls="nav-profile" aria-selected="true">預約</a>
                </div>
              </nav>

              <div class="col-12 tab-content" id="nav-tabContent">
                <div class="tab-pane fade" id="nav-trans-future" role="tabpanel" aria-labelledby="nav-profile-tab"></div>

                <div class="ttb-input-block tab-pane fade show active" id="nav-trans-now" role="tabpanel" aria-labelledby="nav-home-tab">
                  <div class="ttb-message"><span></span></div>

                  <form id="transferForm" action="${pageContext.request.contextPath}/TwdTransfer/go-to-p2" method="post" style="width:100%">
                  
                  <input type="hidden" id="finalToBank" name="toBank" value="">
                  <input type="hidden" id="finalToAcct" name="toAcct" value="">

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
                        <select id="fromAcct" name="fromAcct" class="custom-select select-input half-input" onchange="updateBalance(this)">
                            <option value="">--請選擇帳戶--</option>
                            <c:forEach items="${myAccounts}" var="acc">
                                <c:set var="balance" value="${acc.bal != null ? acc.bal : (acc.BAL != null ? acc.BAL : '0')}" />
                                <option value="${acc.acn}" data-balance="${balance}">
                                    ${acc.acn}
                                </option>
                            </c:forEach>
                        </select>
                        
                        <div>
                          <span class="input-unit">帳戶餘額: 
                              <span id="displayBalance">0.00</span>
                          </span>
                        </div>
                      </div>
                    </span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉入帳號</h4></label>
                    </span>
                    <span class="input-block">
                      
                      <div class="ttb-input">
                        <label class="radio-block">
                          約定帳號
                          <input type="radio" name="acctType" value="1" checked />
                          <span class="ttb-radio"></span>
                        </label>
                      </div>
                      <div class="ttb-input">
                        <select id="agreedSelect" class="custom-select select-input half-input">
                            <option value="">--請選擇約定帳號--</option>
                            <c:forEach items="${agreedAccounts}" var="agreed">
                                <option value="${agreed.acn}" data-bank="${agreed.bnkcod}">
                                    (${agreed.bnkcod}) ${agreed.acn}
                                </option>
                            </c:forEach>
                        </select>
                      </div>

                      <div class="ttb-input">
                        <label class="radio-block">
                          非約定帳號
                          <input type="radio" name="acctType" value="2" />
                          <span class="ttb-radio"></span>
                        </label>
                      </div>
                      <div class="ttb-input">
                        <select name="toBank_manual" class="custom-select select-input half-input">
                          <option value="">--請選擇銀行--</option>
                          
                          <c:forEach items="${allBanks}" var="bank">
                              <option value="${bank.code}-${bank.name}">
                                  ${bank.code}-${bank.name}
                              </option>
                          </c:forEach>
                          
                        </select>
                      </div>
                      <div class="ttb-input">
                        <input type="text" name="toAcct_manual" value="" class="text-input" placeholder="請輸入帳號" size="16" maxlength="16" />
                      </div>
                    </span>
                  </div>

                  <div class="ttb-input-item row">
                    <span class="input-title">
                      <label><h4>轉帳金額</h4></label>
                    </span>
                    <span class="input-block">
                      <div class="ttb-input">
                        <input type="text" name="amount" class="text-input" size="8" maxlength="8" value="1000" placeholder="請輸入轉帳金額(新台幣)" />
                        <span class="input-unit">元</span>
                        <br />
                        <span class="input-remarks" style="color: red">[以晶片金融卡執行非約定轉帳或線上約定轉入帳號，交易限額NTD5萬元/筆，NTD10萬元/日，NTD20萬元/月。］</span>
                      </div>
                    </span>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px;">
                      <input type="reset" class="ttb-button btn-flat-gray" value="重新輸入" />
                      <input type="button" id="btnNext" class="ttb-button btn-flat-orange" value="確定" />
                  </div>

                  </form> </div>
              </div>
            </div>

            <ol class="list-decimal description-list">
              <p>說明</p>
              <li>
                查詢<a
                  href="#./交易最高限額表.html"
                  target="_blank"
                  onclick="window.open('./交易最高限額表.html')"
                  >「交易最高限額表」、</a
                ><a
                  href="#./交易最高限額表.html"
                  target="_blank"
                  onclick="window.open('./交易手續費及相關優惠.html')"
                  >「交易手續費及相關優惠」。</a
                >
              </li>
              <li>即時轉帳成功後無法取消，請謹慎使用。</li>
              <li>
                預約轉帳可預約次日起1年內之轉帳交易。預約之轉帳日為歷法所無之日期，以該月之末日為轉帳日，例如：預約固定每月31日轉帳，6月無31日，故該月轉帳日為6月30日。
              </li>
              <li>
                預約轉帳請於轉帳日之前1日，存足款項於轉出帳號備扣。預約轉帳將於轉帳日與即時轉帳併計最高轉出限額。
              </li>
              <li>
                預約成功不代表交易已完成，請於轉帳日利用『預約交易結果查詢』，以確認交易結果。
              </li>
            </ol>
        </section>
      </main>
    </div>
    
    <nav id="footer-breadcrumb-nav">
      <ul>
        <li><a href="#">&nbsp</a></li>
        <li class="top-btn"><button onclick="topFunction()" title="Go to top"><img src="../img/top.svg" /></button></li>
      </ul>
    </nav>
    <script src="../scripts/footer.js"></script>
    <section id="error-block" class="error-block" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:99999; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
        <div class="error-for-message" style="background:#fff; padding:30px; border-radius:10px; min-width:280px; max-width:90%; text-align:center;">
            <h3 id="error-title" class="error-title" style="margin-bottom:20px; color:#333;"></h3>
            <p id="error-content0" class="error-content" style="margin:10px 0; text-align: center; width: 100%;"></p>
            <div style="margin-top:25px;">
                <button id="errorBtn1" class="btn-flat-orange ttb-pup-btn" style="padding:10px 30px; border:none; background:#ff8c00; color:#fff; border-radius:5px; cursor:pointer;">關閉</button>
            </div>
        </div>
    </section>
  </body>
</html>