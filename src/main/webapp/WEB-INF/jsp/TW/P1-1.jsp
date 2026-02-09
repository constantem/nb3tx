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
            
            // 1. 檢查必填
            if (fromAcct == "" || amount == "") {
                alert("請填寫轉出帳號與金額");
                return;
            }

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
                            <option value="">請選擇</option>
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
                        <select
                          class="custom-select select-input half-input"
                        >
                          <option value="000-中央銀行">000-中央銀行</option>
                          <option value="001-連管銀行">001-連管銀行</option>
                          <option value="004-臺灣銀行">004-臺灣銀行</option>
                          <option value="005-土地銀行">005-土地銀行</option>
                          <option value="006-合庫商銀">006-合庫商銀</option>
                          <option value="007-第一銀行">007-第一銀行</option>
                          <option value="008-華南銀行">008-華南銀行</option>
                          <option value="009-彰化銀行">009-彰化銀行</option>
                          <option value="011-上海銀行">011-上海銀行</option>
                          <option value="012-台北富邦">012-台北富邦</option>
                          <option value="013-國泰世華">013-國泰世華</option>
                          <option value="016-高雄銀行">016-高雄銀行</option>
                          <option value="017-兆豐商銀">017-兆豐商銀</option>
                          <option value="018-農業金庫">018-農業金庫</option>
                          <option value="020-日商瑞穗銀行">
                            020-日商瑞穗銀行
                          </option>
                          <option value="021-花旗(台灣)銀行">
                            021-花旗(台灣)銀行
                          </option>
                          <option value="022-美國銀行">022-美國銀行</option>
                          <option value="025-首都銀行">025-首都銀行</option>
                          <option value="039-澳盛(台灣)銀行">
                            039-澳盛(台灣)銀行
                          </option>
                          <option value="048-王道商業銀行">
                            048-王道商業銀行
                          </option>
                          <option value="050-臺灣企銀">050-臺灣企銀</option>
                          <option value="052-渣打商銀">052-渣打商銀</option>
                          <option value="053-台中銀行">053-台中銀行</option>
                          <option value="054-京城商銀">054-京城商銀</option>
                          <option value="057-#$%^&amp;">057-#$%^&amp;</option>
                          <option value="072-德意志銀行">072-德意志銀行</option>
                          <option value="075-東亞銀行">075-東亞銀行</option>
                          <option value="081-匯豐(台灣)銀行">
                            081-匯豐(台灣)銀行
                          </option>
                          <option value="082-法國巴黎銀行">
                            082-法國巴黎銀行
                          </option>
                          <option value="101-瑞興銀行">101-瑞興銀行</option>
                          <option value="102-華泰銀行">102-華泰銀行</option>
                          <option value="103-臺灣新光商銀">
                            103-臺灣新光商銀
                          </option>
                          <option value="104-台北五信">104-台北五信</option>
                          <option value="108-陽信銀行">108-陽信銀行</option>
                          <option value="114-基隆一信">114-基隆一信</option>
                          <option value="115-基隆二信">115-基隆二信</option>
                          <option value="118-板信銀行">118-板信銀行</option>
                          <option value="119-淡水一信">119-淡水一信</option>
                          <option value="120-淡水信合社">120-淡水信合社</option>
                          <option value="124-宜蘭信合社">124-宜蘭信合社</option>
                          <option value="127-桃園信合社">127-桃園信合社</option>
                          <option value="130-新竹一信">130-新竹一信</option>
                          <option value="132-新竹三信">132-新竹三信</option>
                          <option value="146-台中二信">146-台中二信</option>
                          <option value="147-三信銀行">147-三信銀行</option>
                          <option value="158-彰化一信">158-彰化一信</option>
                          <option value="161-彰化五信">161-彰化五信</option>
                          <option value="162-彰化六信">162-彰化六信</option>
                          <option value="163-彰化十信">163-彰化十信</option>
                          <option value="165-鹿港信合社">165-鹿港信合社</option>
                          <option value="178-嘉義三信">178-嘉義三信</option>
                          <option value="188-台南三信">188-台南三信</option>
                          <option value="204-高雄三信">204-高雄三信</option>
                          <option value="215-花蓮一信">215-花蓮一信</option>
                          <option value="216-花蓮二信">216-花蓮二信</option>
                          <option value="222-澎湖一信">222-澎湖一信</option>
                          <option value="223-澎湖二信">223-澎湖二信</option>
                          <option value="224-金門信合社">224-金門信合社</option>
                          <option value="501-宜蘭縣蘇澳區漁會">
                            501-宜蘭縣蘇澳區漁會
                          </option>
                          <option value="502-宜蘭縣頭城區漁會">
                            502-宜蘭縣頭城區漁會
                          </option>
                          <option value="503-基隆漁會">503-基隆漁會</option>
                          <option value="504-瑞芳萬里漁會">
                            504-瑞芳萬里漁會
                          </option>
                          <option value="505-頭城蘇澳漁會">
                            505-頭城蘇澳漁會
                          </option>
                          <option value="506-桃園漁會">506-桃園漁會</option>
                          <option value="507-新竹漁會">507-新竹漁會</option>
                          <option value="508-通苑漁會">508-通苑漁會</option>
                          <option value="510-南龍漁會">510-南龍漁會</option>
                          <option value="511-彰化漁會">511-彰化漁會</option>
                          <option value="512-雲林漁會">512-雲林漁會</option>
                          <option value="513-新北市瑞芳區漁會">
                            513-新北市瑞芳區漁會
                          </option>
                          <option value="514-新北市萬里區漁會">
                            514-新北市萬里區漁會
                          </option>
                          <option value="515-嘉義漁會">515-嘉義漁會</option>
                          <option value="516-基隆市基隆區漁會">
                            516-基隆市基隆區漁會
                          </option>
                          <option value="517-南市區漁會">517-南市區漁會</option>
                          <option value="518-南縣漁會">518-南縣漁會</option>
                          <option value="519-新化區農會">519-新化區農會</option>
                          <option value="520-高雄市小港區漁會">
                            520-高雄市小港區漁會
                          </option>
                          <option value="521-高雄縣漁會">521-高雄縣漁會</option>
                          <option value="523-枋寮區漁會">523-枋寮區漁會</option>
                          <option value="524-新港漁會">524-新港漁會</option>
                          <option value="525-澎湖區漁會">525-澎湖區漁會</option>
                          <option value="526-金門漁會">526-金門漁會</option>
                          <option value="538-宜蘭縣宜蘭市農會">
                            538-宜蘭縣宜蘭市農會
                          </option>
                          <option value="541-白河區農會">541-白河區農會</option>
                          <option value="542-麻豆農會">542-麻豆農會</option>
                          <option value="547-後壁區農會">547-後壁區農會</option>
                          <option value="549-臺南市下營區農會">
                            549-臺南市下營區農會
                          </option>
                          <option value="551-臺南市官田區農會">
                            551-臺南市官田區農會
                          </option>
                          <option value="552-臺南市大內區農會">
                            552-臺南市大內區農會
                          </option>
                          <option value="556-學甲區農會">556-學甲區農會</option>
                          <option value="557-新市農會">557-新市農會</option>
                          <option value="558-臺南市安定區農會">
                            558-臺南市安定區農會
                          </option>
                          <option value="559-山上區農會">559-山上區農會</option>
                          <option value="561-左鎮區農會">561-左鎮區農會</option>
                          <option value="562-臺南市仁德區農會">
                            562-臺南市仁德區農會
                          </option>
                          <option value="564-關廟區農會">564-關廟區農會</option>
                          <option value="565-龍崎區農會">565-龍崎區農會</option>
                          <option value="567-臺南市南化區農會">
                            567-臺南市南化區農會
                          </option>
                          <option value="568-臺南市七股區農會">
                            568-臺南市七股區農會
                          </option>
                          <option value="570-南投農會">570-南投農會</option>
                          <option value="573-埔里農會">573-埔里農會</option>
                          <option value="574-竹山農會">574-竹山農會</option>
                          <option value="575-中寮農會">575-中寮農會</option>
                          <option value="577-魚池農會">577-魚池農會</option>
                          <option value="578-水里農會">578-水里農會</option>
                          <option value="579-國姓農會">579-國姓農會</option>
                          <option value="580-鹿谷農會">580-鹿谷農會</option>
                          <option value="581-信義農會">581-信義農會</option>
                          <option value="582-仁愛農會">582-仁愛農會</option>
                          <option value="583-東山區農會">583-東山區農會</option>
                          <option value="585-宜蘭縣頭城鎮農會">
                            585-宜蘭縣頭城鎮農會
                          </option>
                          <option value="586-宜蘭縣羅東鎮農會">
                            586-宜蘭縣羅東鎮農會
                          </option>
                          <option value="587-礁溪鄉農會">587-礁溪鄉農會</option>
                          <option value="588-宜蘭縣壯圍鄉農會">
                            588-宜蘭縣壯圍鄉農會
                          </option>
                          <option value="589-宜蘭縣員山鄉農會">
                            589-宜蘭縣員山鄉農會
                          </option>
                          <option value="596-宜蘭縣五結鄉農會">
                            596-宜蘭縣五結鄉農會
                          </option>
                          <option value="598-宜蘭縣蘇澳地區農會">
                            598-宜蘭縣蘇澳地區農會
                          </option>
                          <option value="599-宜蘭縣三星地區農會">
                            599-宜蘭縣三星地區農會
                          </option>
                          <option value="600-農金資中心">600-農金資中心</option>
                          <option value="602-中華民國農會中壢辦事處信用部">
                            602-中華民國農會中壢辦事處信用部
                          </option>
                          <option value="603-基隆農會">603-基隆農會</option>
                          <option value="605-高雄市高雄地區農會">
                            605-高雄市高雄地區農會
                          </option>
                          <option value="607-宜蘭縣農會">607-宜蘭縣農會</option>
                          <option value="608-桃園市農會">608-桃園市農會</option>
                          <option value="609-中華民國農會">
                            609-中華民國農會
                          </option>
                          <option value="610-新竹鄉農會">610-新竹鄉農會</option>
                          <option value="611-後龍農會">611-後龍農會</option>
                          <option value="612-神岡鄉農會">612-神岡鄉農會</option>
                          <option value="613-名間農會">613-名間農會</option>
                          <option value="614-彰化縣農會">614-彰化縣農會</option>
                          <option value="615-基隆市基隆市農會">
                            615-基隆市基隆市農會
                          </option>
                          <option value="616-雲林縣農會">616-雲林縣農會</option>
                          <option value="617-嘉義縣農會">617-嘉義縣農會</option>
                          <option value="618-台南縣農會">618-台南縣農會</option>
                          <option value="619-高雄縣農會">619-高雄縣農會</option>
                          <option value="620-屏東縣農會">620-屏東縣農會</option>
                          <option value="621-花蓮縣農會">621-花蓮縣農會</option>
                          <option value="622-台東縣農會">622-台東縣農會</option>
                          <option value="623-台北市農會">623-台北市農會</option>
                          <option value="624-澎湖農會">624-澎湖農會</option>
                          <option value="625-台中市台中地區農會">
                            625-台中市台中地區農會
                          </option>
                          <option value="627-連江縣農會">627-連江縣農會</option>
                          <option value="628-鹿港鎮農會">628-鹿港鎮農會</option>
                          <option value="629-和美鎮農會">629-和美鎮農會</option>
                          <option value="631-溪湖農會">631-溪湖農會</option>
                          <option value="632-田中鎮農會">632-田中鎮農會</option>
                          <option value="633-北斗農會">633-北斗農會</option>
                          <option value="635-線西農會">635-線西農會</option>
                          <option value="636-伸港農會">636-伸港農會</option>
                          <option value="638-花壇農會">638-花壇農會</option>
                          <option value="639-大村農會">639-大村農會</option>
                          <option value="642-社頭農會">642-社頭農會</option>
                          <option value="643-二水鄉農會">643-二水鄉農會</option>
                          <option value="646-大城農會">646-大城農會</option>
                          <option value="647-溪州農會">647-溪州農會</option>
                          <option value="649-埔鹽農會">649-埔鹽農會</option>
                          <option value="650-福興農會">650-福興農會</option>
                          <option value="651-彰化農會">651-彰化農會</option>
                          <option value="683-北港農會">683-北港農會</option>
                          <option value="685-土庫農會">685-土庫農會</option>
                          <option value="693-東勢鄉農會">693-東勢鄉農會</option>
                          <option value="696-水林農會">696-水林農會</option>
                          <option value="697-元長農會">697-元長農會</option>
                          <option value="698-麥寮鄉農會">698-麥寮鄉農會</option>
                          <option value="699-林內農會">699-林內農會</option>
                          <option value="700-中華郵政">700-中華郵政</option>
                          <option value="749-內埔農會">749-內埔農會</option>
                          <option value="762-桃園市大溪區農會">
                            762-桃園市大溪區農會
                          </option>
                          <option value="763-桃園市桃園區農會">
                            763-桃園市桃園區農會
                          </option>
                          <option value="764-桃園市平鎮區農會">
                            764-桃園市平鎮區農會
                          </option>
                          <option value="765-桃園市楊梅區農會">
                            765-桃園市楊梅區農會
                          </option>
                          <option value="766-桃園市大園區農會">
                            766-桃園市大園區農會
                          </option>
                          <option value="767-桃園市蘆竹區農會">
                            767-桃園市蘆竹區農會
                          </option>
                          <option value="768-桃園市龜山區農會">
                            768-桃園市龜山區農會
                          </option>
                          <option value="769-桃園市八德區農會">
                            769-桃園市八德區農會
                          </option>
                          <option value="770-桃園市新屋區農會">
                            770-桃園市新屋區農會
                          </option>
                          <option value="771-桃園市龍潭區農會">
                            771-桃園市龍潭區農會
                          </option>
                          <option value="772-桃園市復興區農會">
                            772-桃園市復興區農會
                          </option>
                          <option value="773-桃園市觀音區農會">
                            773-桃園市觀音區農會
                          </option>
                          <option value="775-新北市土城區農會">
                            775-新北市土城區農會
                          </option>
                          <option value="776-新北市三重區農會">
                            776-新北市三重區農會
                          </option>
                          <option value="777-新北市中和地區農會">
                            777-新北市中和地區農會
                          </option>
                          <option value="778-新北市淡水區農會">
                            778-新北市淡水區農會
                          </option>
                          <option value="779-新北市樹林區農會">
                            779-新北市樹林區農會
                          </option>
                          <option value="780-新北市鶯歌區農會">
                            780-新北市鶯歌區農會
                          </option>
                          <option value="781-新北市三峽區農會">
                            781-新北市三峽區農會
                          </option>
                          <option value="785-新北市蘆洲區農會">
                            785-新北市蘆洲區農會
                          </option>
                          <option value="786-新北市五股區農會">
                            786-新北市五股區農會
                          </option>
                          <option value="787-新北市林口區農會">
                            787-新北市林口區農會
                          </option>
                          <option value="788-新北市泰山區農會">
                            788-新北市泰山區農會
                          </option>
                          <option value="789-新北市坪林區漁會">
                            789-新北市坪林區漁會
                          </option>
                          <option value="790-新北市八里區農會">
                            790-新北市八里區農會
                          </option>
                          <option value="791-新北市金山地區農會">
                            791-新北市金山地區農會
                          </option>
                          <option value="792-新北市瑞芳地區農會">
                            792-新北市瑞芳地區農會
                          </option>
                          <option value="793-新北市新店地區農會">
                            793-新北市新店地區農會
                          </option>
                          <option value="795-新北市深坑區漁會">
                            795-新北市深坑區漁會
                          </option>
                          <option value="796-新北市石碇區農會">
                            796-新北市石碇區農會
                          </option>
                          <option value="797-新北市平溪區漁會">
                            797-新北市平溪區漁會
                          </option>
                          <option value="798-新北市石門區農會">
                            798-新北市石門區農會
                          </option>
                          <option value="799-新北市三芝區農會">
                            799-新北市三芝區農會
                          </option>
                          <option value="803-聯邦銀行">803-聯邦銀行</option>
                          <option value="805-遠東銀行">805-遠東銀行</option>
                          <option value="806-元大銀行">806-元大銀行</option>
                          <option value="807-永豐銀行">807-永豐銀行</option>
                          <option value="808-玉山銀行">808-玉山銀行</option>
                          <option value="809-凱基銀行">809-凱基銀行</option>
                          <option value="810-星展(台灣)銀行">
                            810-星展(台灣)銀行
                          </option>
                          <option value="812-台新銀行">812-台新銀行</option>
                          <option value="814-大眾銀行">814-大眾銀行</option>
                          <option value="815-日盛銀行">815-日盛銀行</option>
                          <option value="816-安泰銀行">816-安泰銀行</option>
                          <option value="822-中國信託">822-中國信託</option>
                          <option value="860-中埔農會">860-中埔農會</option>
                          <option value="866-阿里山鄉農會">
                            866-阿里山鄉農會
                          </option>
                          <option value="868-東勢農會">868-東勢農會</option>
                          <option value="869-清水區農會">869-清水區農會</option>
                          <option value="870-梧棲農會">870-梧棲農會</option>
                          <option value="871-大甲農會">871-大甲農會</option>
                          <option value="872-沙鹿農會">872-沙鹿農會</option>
                          <option value="875-太平區農會">875-太平區農會</option>
                          <option value="876-烏日區農會">876-烏日區農會</option>
                          <option value="877-后里區農會">877-后里區農會</option>
                          <option value="878-大雅區農會">878-大雅區農會</option>
                          <option value="879-潭子區農會">879-潭子區農會</option>
                          <option value="880-石岡農會">880-石岡農會</option>
                          <option value="881-新社農會">881-新社農會</option>
                          <option value="882-大肚農會">882-大肚農會</option>
                          <option value="883-外埔農會">883-外埔農會</option>
                          <option value="884-大安農會">884-大安農會</option>
                          <option value="885-龍井區農會">885-龍井區農會</option>
                          <option value="886-和平農會">886-和平農會</option>
                          <option value="888-test">888-test</option>
                          <option value="891-花蓮市農會">891-花蓮市農會</option>
                          <option value="895-瑞穗鄉農會">895-瑞穗鄉農會</option>
                          <option value="896-玉溪地區農會">
                            896-玉溪地區農會
                          </option>
                          <option value="897-鳳榮地區農會">
                            897-鳳榮地區農會
                          </option>
                          <option value="898-光豐地區農會">
                            898-光豐地區農會
                          </option>
                          <option value="901-大里市農會">901-大里市農會</option>
                          <option value="902-苗栗市農會">902-苗栗市農會</option>
                          <option value="903-汐止農會">903-汐止農會</option>
                          <option value="904-新莊農會">904-新莊農會</option>
                          <option value="906-頭份市農會">906-頭份市農會</option>
                          <option value="907-竹南鎮農會">907-竹南鎮農會</option>
                          <option value="908-通宵鎮農會">908-通宵鎮農會</option>
                          <option value="909-苑裡鎮農會">909-苑裡鎮農會</option>
                          <option value="910-桃農中心">910-桃農中心</option>
                          <option value="912-冬山農會">912-冬山農會</option>
                          <option value="913-苗栗縣後龍鎮農會">
                            913-苗栗縣後龍鎮農會
                          </option>
                          <option value="914-卓蘭農會">914-卓蘭農會</option>
                          <option value="915-西湖農會">915-西湖農會</option>
                          <option value="916-草屯農會">916-草屯農會</option>
                          <option value="917-公館農會">917-公館農會</option>
                          <option value="918-銅鑼農會">918-銅鑼農會</option>
                          <option value="919-三義農會">919-三義農會</option>
                          <option value="920-造橋鄉農會">920-造橋鄉農會</option>
                          <option value="921-南庄農會">921-南庄農會</option>
                          <option value="922-臺南市臺南地區農會">
                            922-臺南市臺南地區農會
                          </option>
                          <option value="923-獅潭鄉農會">923-獅潭鄉農會</option>
                          <option value="924-頭屋鄉農會">924-頭屋鄉農會</option>
                          <option value="925-三灣鄉農會">925-三灣鄉農會</option>
                          <option value="926-大湖地區農會">
                            926-大湖地區農會
                          </option>
                          <option value="928-板橋農會">928-板橋農會</option>
                          <option value="932-新竹縣湖口鄉農會">
                            932-新竹縣湖口鄉農會
                          </option>
                          <option value="933-新竹縣芎林鄉農會">
                            933-新竹縣芎林鄉農會
                          </option>
                          <option value="935-新竹縣峨眉鄉農會">
                            935-新竹縣峨眉鄉農會
                          </option>
                          <option value="938-新竹縣橫山地區農會">
                            938-新竹縣橫山地區農會
                          </option>
                          <option value="939-新竹縣新豐鄉農會">
                            939-新竹縣新豐鄉農會
                          </option>
                          <option value="951-北農中心">951-北農中心</option>
                          <option value="953-田尾農會">953-田尾農會</option>
                          <option value="954-中農中心">954-中農中心</option>
                          <option value="984-臺北市北投區農會">
                            984-臺北市北投區農會
                          </option>
                          <option value="985-臺北市士林區農會">
                            985-臺北市士林區農會
                          </option>
                          <option value="986-臺北市內湖區農會">
                            986-臺北市內湖區農會
                          </option>
                          <option value="987-臺北市南港區農會">
                            987-臺北市南港區農會
                          </option>
                          <option value="988-臺北市木柵區農會">
                            988-臺北市木柵區農會
                          </option>
                          <option value="989-臺北市景美區農會">
                            989-臺北市景美區農會
                          </option>
                          <option value="TST-測試">TST-測試</option>
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
              <li>查詢<a href="#" target="_blank">「交易最高限額表」、</a><a href="#" target="_blank">「交易手續費及相關優惠」。</a></li>
              <li>即時轉帳成功後無法取消，請謹慎使用。</li>
              <li>預約轉帳可預約次日起1年內之轉帳交易...</li>
              <li>預約轉帳請於轉帳日之前1日，存足款項...</li>
              <li>預約成功不代表交易已完成...</li>
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