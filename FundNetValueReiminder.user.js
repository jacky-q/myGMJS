// ==UserScript==
// @name    FundNetValueReminder
// @description  基金净值提示
// @version  2
// @namespace net.jacky-q.userscript
// @updateURL	https://github.com/jacky-q/myGMJS/blob/master/FundNetValueReiminder.user.js
// @grant    GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include http://www.1234567.com.cn/
// ==/UserScript==
var MONITOR_THRESHOD = 0.0;
var MONITOR_GIVEUP_THRESHOLD = 0.05;
var MONITOR_LOCATION = "http://fund.eastmoney.com/f10/jjjz_%fund_code%.html";
var MONITOR_INTERVAL = 30 * 1000;
var MONITOR_LIST = [{
    fund_code: "100032",
    fund_name: "富国中证红利指数增强",
    net_value: 0.9426,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "000968",
    fund_name: "广发养老指数A(000968)",
    net_value: 0.8507,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "160416",
    fund_name: "华安标普石油指数(160416)",
    net_value: 0.871,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "001051",
    fund_name: "华夏上证50ETF联接A(001051)",
    net_value: 0.731,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "001180",
    fund_name: "广发医药卫生联接A(001180)",
    net_value: 0.8153,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "162411",
    fund_name: "华宝标普石油指数(162411)",
    net_value: 0.502,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "000051",
    fund_name: "华夏沪深300ETF联接A(000051)",
    net_value: 0.965,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "000071",
    fund_name: "华夏恒生ETF联接(000071)",
    net_value: 1.025,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "270048",
    fund_name: "广发纯债债券A(270048)",
    net_value: 1.164,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "000614",
    fund_name: "华安德国30(DAX)联接(000614)",
    net_value: 1.006,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "050027",
    fund_name: "博时信用债纯债债券A(050027)",
    net_value: 1.044,
    monitor_flag: true,
    alert_tip : false
}, {
    fund_code: "003376",
    fund_name: "广发中债7-10年国开债指数A(003376)",
    net_value: 0.558,
    monitor_flag: true,
    alert_tip : false
}];


// the guts of this userscript
function main() {
    // console.log(typeof $.ajax);
    setInterval(function () {
        var fundList = loadMonitorItem();
        console.log("当前监控基金数:" +  fundList.length);
        for (var i = 0; i < fundList.length; i++) {
            var d = showAlert(fundList[i]);
            loadNetValue(fundList[i], d);
        }
    }, MONITOR_INTERVAL);


}

function showAlert(item) {
    return function (/*curFundNet*/) {
        // console.log("get data:"+item.fund_name);
        var curFundNet = arguments.length > 0 ? arguments[0] : 10000;
        // console.log(item.fund_name + " net value2 :" + curFundNet);
        // console.log("get diff:" + (curFundNet - item['net_value']) / item['net_value'] );
        if ((curFundNet - item['net_value']) / item['net_value'] <= MONITOR_THRESHOD) {
            var tipText = ("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\r\n" + item['fund_name'] + '的净值达到' + curFundNet + ",逼近监视阈值" + item['net_value'] + "\r\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
						console.log(tipText);
            if(!item.alert_tip){
              alert(tipText);
              updateAlertTip(item);
            }
          //  alert(item['fund_name'] + '的净值达到' + curFundNet + ",逼近监视阈值" + item['net_value'] + "!");
        } else if (curFundNet - item['net_value'] > MONITOR_GIVEUP_THRESHOLD) {
            removeMonitor(item);
        }

    }
}

function removeMonitor(item) {
    for (var i = 0; i < MONITOR_LIST.length; i++) {
        if (item['fund_code'] === MONITOR_LIST[i].fund_code) {
            MONITOR_LIST[i].monitor_flag = false;
            console.log("移除监控基金:"+item.fund_name);
        }
    }
}
function updateAlertTip(item) {
    for (var i = 0; i < MONITOR_LIST.length; i++) {
        if (item['fund_code'] === MONITOR_LIST[i].fund_code) {
            MONITOR_LIST[i].alert_tip = true;
        }
    }
}

function loadMonitorItem() {
    var list = [];
    for (var i = 0; i < MONITOR_LIST.length; i++) {
          if(MONITOR_LIST[i].monitor_flag){
              list.push(MONITOR_LIST[i]);
          }
    }
    return list;
}

function loadNetValue(item, callback) {
  //console.log("开始获取估算净值" + item.fund_name);
    if(!item.monitor_flag){
        return;
    }
    var url = MONITOR_LOCATION.replace("%fund_code%", item['fund_code']);
    url +="&tmp=" + new Date().getTime();
   //  console.log("url=" + url);

    $.ajax(url, {
        success: function (data, status, xhr) {
            var net = data.match(/lar bold guzhi">((\d|\.)+)<\/span>/);
         //   console.log(item.fund_name + "当前估值:" + net[1]);
            var fundNet = parseFloat(net[1]);
          //  console.log(item.fund_name + " net value1 :" + fundNet);
            callback(fundNet);
        },
        error: function () {
            console.log("error fetch:"  + item['fund_name']);
        }
    })
    //   var curFundNet = 2.530;
    //   callback.call(curFundNet);

}

// load jQuery and execute the main function
main();
