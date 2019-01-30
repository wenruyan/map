export default{
  // 传入时间戳进行格式处理
  timestampToTime(){
    function timestampToTime(timestamp, flag,flagTwo,flagThree) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      Y = date.getFullYear();
      M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      if (flag) {
        return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
      }
      if(flagTwo){
        return h + ':' + m + ':' + s;
      }
      if(flagThree){
        return M + '-' + D + ' ' + h + ':' + m;
      }
      return  h + ':' + m + '-' + M + '-' + D;
    }
  },
   // 获取当前日期
   getNowFormatDate(){
    function getNowFormatDate(flag) {
      var date = new Date();
      // 获取当前日期前一天
      if(flag){
        date = new Date(date.getTime() - 24*60*60*1000)
      }
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  },
  // 获取当前时间（时分秒）
  getNow(){
    function getNow(flag){
      var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      if(flag){
        return h + ':' + m;
      }
      return h + ':' + m + ':' + s;
    }
  },
  // 获取指定日期下一天
  getNextDay(){ 
    function getNextDay(d) {
      d = new Date(d);
      d = +d + 1000 * 60 * 60 * 24;
      d = new Date(d);
      //return d;
      //格式化
      M = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      D = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      return d.getFullYear() + "-" + M + "-" + D;
    }
  },
  reduceRepeat(){
    // 二维数组去重
    function reduceRepeat(arr) {
      var temp;
      var count;
      for (var i = 0; i < arr.length; i++) { // 第一次遍历数组，确保数组里的子数组都能被检测
        temp = arr[i]; // 存储被检测的当前子数组
        for (var k = 0; k < arr.length; k++) {
          if (k != i && arr[k].length == temp.length) { // 第二次遍历数组，检测除了被检测数组本身以及两者长度不一样的子数组
            count = 0; // 初始化
            for (var j = 0; j < arr[k].length; j++) { // 遍历检测的子数组
              if (arr[k][j] == temp[j]) {
                count++;  // 记录检测子数组与被检测子数组中的元素重复次数
              }
            }
            if (count == temp.length) { // 如果次数与被检测子数组的长度相等，代表两者重复
              arr.splice(k, 1); // 删除该重复元素
              k--; // 数组长度变化，K需要减一回到当前位置
            }
          }
        }
      }
      return arr;
    }
  },
  getMax(){
    // 获取二维数组中的最大值
    function getMax(data) {
      var result = [];
      data.forEach(function(item,index){
        result.push(+item[1]);
      })
      return Math.max.apply(null, result);
    }
  },
  getMin(){
    // 获取二维数组中的最小值
    function getMin(data) {
      var result = [];
      data.forEach(function(item,index){
        result.push(+item[1]);
      })
      return Math.min.apply(null, result);
    }

  },
  judgeLength(){
      // 判断数组长度，如果小于某值，则向数组中添加''
    function judgeLength(arr, num) {
      if (arr.length < num) {
        var arrTemp = arr;
        arr = [];
        for (let i = 0; i < num - arrTemp.length; i++) {
          arr.push('');
        }
        arr = arr.concat(arrTemp);
      }
      return arr;
    }
  },
  judgeLengthGt(){
    // 判断数组长度，如果大于某值，遍历数组，删去数组中的一个值，并向数组中添加一个值
    function judgeLengthGt(dataArr, arr, num) {
      if (dataArr.length >= num) {
        dataArr.forEach(function (item, index) {
          arr.shift();
          if (item[1]) {
            arr.push(item[1]);
          }
          else {
            arr.push('');
          }
        });
      }
      return arr;
    }
  },
  thousands(){
    // 将数据以三位分节法展示
    function thousands(num) {
      var str = num.toString();
      var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
      return str.replace(reg, "$1,");
    }
  },
  getDateDiff(){
    function getDateDiff(startDate, endDate) {
      var diff = (+(endDate - startDate)) / 1000;
      var day = diff / 86400;
      var hour = diff / 3600;
      var minute = diff / 60;
      return [day,hour,minute];
    }
  },
  intervalRender(){
    var arrInterval = ['5min','10min','15min','30min','1hour','2hour'];
    var dataInterval = {};
    var intervalUl =  $('.history .intervalUl ul');
    intervalRender(arrInterval);
    function intervalRender(data){
      var list = [];
      data.forEach(function(item,index){
        list.push({
          'param':item
        })
      })
      dataInterval.list = list;
      intervalUl.html(template('tplAggSelect', dataInterval));
    }
  },
  changeInterval(){
    // 频率选择随日历选择变化而变化
    function changeInterval(){
      // input值改变需要时间
      setTimeout(() => {
        var startTsValue = $('.historyData .startTimeUl ul li input').val();
        var startTs = new Date(startTsValue + ':00').getTime();
        var endTsValue = $('.historyData .endTimeUl ul li input').val();
        var endTs = new Date(endTsValue + ':00').getTime();
        var diffNum;
        if (endTs - startTs <= 0) {
          var tip = $('.historyData .tip p');
          tip.text('Please check current end time');
          tip.fadeIn().delay(2000).fadeOut();
        } else {
          diffNum = getDateDiff(startTs,endTs);
          if(diffNum[0] < 1){
            if(diffNum[1] < 1){
              if(diffNum[2] <= 9){
                arrInterval = ['1s','5s','10s','15s','30s'];
                intervalRender(arrInterval);
              } else if(diffNum[2] <= 59){
                arrInterval = ['5s','10s','15s','30s','1min'];
                intervalRender(arrInterval);
              }
            } else if(diffNum[1] <= 9){
              arrInterval = ['10s','15s','30s','1min','2min'];
              intervalRender(arrInterval);
            } else if(diffNum[1] <= 23){
              arrInterval = ['2min','5min','10min','15min','30min','1hour'];
              intervalRender(arrInterval);
            }
          }
          else if(diffNum[0] == 1){
            arrInterval = ['5min','10min','15min','30min','1hour','2hour'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 3){
            arrInterval = ['10min','15min','30min','1hour','2hour'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 5){
            arrInterval = ['15min','30min','1hour','2hour','5hour'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 10){
            arrInterval = ['30min','1hour','2hour','5hour','10hour','12hour'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 20){
            arrInterval = ['1hour','2hour','5hour','10hour','12hour','1day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 40){
            arrInterval = ['2hour','5hour','10hour','12hour','1day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 69){
            arrInterval = ['5hour','10hour','12hour','1day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 104){
            arrInterval = ['5hour','10hour','12hour','1day','7day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 204){
            arrInterval = ['10hour','12hour','1day','7day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 297){
            arrInterval = ['12hour','1day','7day','30day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 554){
            arrInterval = ['1day','7day','30day'];
            intervalRender(arrInterval);
          } else if(diffNum[0] <= 3495){
            arrInterval = ['7day','30day'];
            intervalRender(arrInterval);
          } else {
            arrInterval = ['30day'];
            intervalRender(arrInterval);
          }
        }
      }, 500);
    
    }
  }



}




