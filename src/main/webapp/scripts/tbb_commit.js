 var isE2E = 'Y';
    
        // IEä¸æ¯æ´jquery.startsWithï¼ææ°å¢
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
        // IEä¸æ¯æ´jquery.endsWithï¼ææ°å¢
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position)
                    || Math.floor(position) !== position
                    || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };




        
        // å®¢è£½åalertè¦çª
    
        function errorBlock(errortitle, errorcontent, errorinfo, errorBtn1, errorBtn2) {
    // 		$("#error-content0").html("");
            $('p[id^=error-]').html("");
            wait1=true;
            setTimeout("wait1=false;", 500);
            $('#error-block').show();
            
            deadOrAlive("error-title", errortitle);
            
            // ç½®å·¦è¨æ¯
            errorBlockMsg("error-content", errorcontent);
            // ç½®ä¸­è¨æ¯
            errorBlockMsg("error-info", errorinfo);
            
            
             deadOrAlive("errorBtn1", errorBtn1);
             deadOrAlive("errorBtn2", errorBtn2);
            
            $("#errorBtn1").click(function() {
                $('#error-block').hide();
            });
            
        }
        // errorBlocké¨ä½ä¿çæåªé¤
        function deadOrAlive(key, value) {
            if( value!=null ) {
                $("#"+key).html(value);
                $("#"+key).show();
            }else{
                $("#"+key).hide();
            }
        }
        // è¨æ¯èç
        function errorBlockMsg(type, strArray) {
            if( strArray!=null ) {
                strArray.forEach(function(str, index) {
                    var before = index-1;
                    if(index==0){
                        deadOrAlive(type+index, str);
                    } else {
                        var text = document.createElement("p");
                        text.id = type+index;
                        text.class = type;
                        $('#'+type+before).append(text);
                        if(str.indexOf("&{red}")!=-1){
                            text.style.color="red";
                            str=str.replace("&{red}","");
                        }
                        deadOrAlive(type+index, str);
                    }
                });
            }
        }


/**
 * 初始化BlockUI
 */
 var initBlockId;

function initBlockUI() {
	initBlockId = blockUI();
}

/**
 * 畫面BLOCK
 */
var isLoading;
function blockUI(timeout){
	$("#loadingBox").css("height",$(document).height());
	$("#loadingBox").show();
	
	// 遮罩後不給捲動
	document.body.style.overflow = "hidden";
	
	var defaultTimeout = 60000;
	if(timeout){	
		defaultTimeout = timeout;
	}
	var timeoutID = setTimeout("confirmWait(" + defaultTimeout + ");",defaultTimeout);
	isLoading = true;
	
	return timeoutID;
}

/**
 * 畫面UNBLOCK
 */
function unBlockUI(timeoutID){
	if(timeoutID){
		clearTimeout(timeoutID);
	}
	$("#loadingBox").hide();
	isLoading=false;
	// 解遮罩後給捲動
	document.body.style.overflow = 'auto';
}

/**
 * BLOCK超過時間後的CONFIRM
 */
function confirmWait(timeout){
	if(isLoading){
//		if(confirm("是否繼續等待？")){
			blockUI(timeout);
//		}
//		else{
//			unBlockUI();
//		}
	}
}
