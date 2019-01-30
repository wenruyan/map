<template>
    <div class="firstasset" style="height:100%">
        <div class="asset">
            <div id="left">
                <div class="lTop" style="height:10%;position:relative">
                  <div class="name">Site</div>
                  <div class="selectType">
                      <ul class="clearfix">
                        <li>
                        <label>
                            <input type="checkbox" class="single al">
                            <b></b>
                        </label>
                        <span class="Active">Alarm</span>
                        </li>
                        <li>
                        <label>
                            <input type="checkbox" class="single nor">
                            <b></b>
                        </label>
                        <span class="Idle">Normal</span>
                        </li>
                      </ul>
                  </div>
                </div>
                <div id="allMap"></div>
            </div>
            <div class="right">
                <div class="dressTop">
                    <p class="university">
                        {{this.mapName}}
                    </p>
                    <p>
                        <span style="font-weight:bold;display;width: 100%;display: inline-block;padding-left: 12%;position: relative;">{{this.mapAdress}}
                            <Icon type="md-pin" style="font-size:20px;color:#42C62C;position: absolute;top:0;left:0"/>
                        </span>
                    </p>
                    <p>
                        <img src="../img/dress.png" alt="" style="margin-top:16px">
                    </p>
                </div>
                <div class="dressBottom">
                    <p style="color:#99A5B6">Refresh Time</p>
                    <p style="">{{this.mapTime}}</p>
                    <p style="color:#99A5B6">{{this.mapStatus}}</p>
                    <p>Status</p>
                </div>
            </div>
        </div>
        <div style="height:2%"></div>
        <div class="alarmTable" data="tableData" ref="tableData">
            <!-- <div class="tableName">{{this.mapStatus}}</div> -->
            <div class="tableName">Alarm</div>
            <Table :columns="columns" :data="tableData" :height="tableHeight"></Table>
        </div>
    </div>
</template>

<script>
import $ from "jquery";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
// import google from "google";
import BMap from "BMap";
export default {
  data(){
          return{
            lastStartTs: "",
            mapName: "",
            mapAdress: "",
            mapTime: "",
            mapStatus: "",
            tableData: [],
            tableHeight: "",
            columns: [
              {
                title: "Station Name",
                key: "stationName"
              },
              {
                title: "Device Name",
                key: "deviceName"
              },
              {
                title: "Parame Name",
                key: "attr"
              },
              {
                title: "Start Time",
                key: "startTs"
              },
              {
                title: "Status",
                key: "status",
                width: 100,
                align: "center",
                render: (h, params) => {
                  if (params.row.status == 1) {
                    return h("div", [
                      h("Icon", {
                        props: {
                          type: "ios-information-circle",
                          size: 20,
                          color: "red"
                        },
                        on: {
                          click: (data, index, event) => {}
                        }
                      })
                    ]);
                  } else {
                    return h("div", [
                      h("Icon", {
                        props: {
                          type: "ios-information-circle",
                          size: 20,
                          color: "green"
                        },
                        on: {
                          click: (data, index, event) => {}
                        }
                      })
                    ]);
                  }
                }
              },
              {
                title: "Severity",
                key: "severity",
                width: 100
              }
            ],
            dataArrAlarm: [],
            // 正常站点数据
            dataArrNormal: [],
            // 所有站点数据
            dataArrAll: [],
            infoRender: true,
            firstRenderMap: true,
            item:'',
            firstRenderMap: true,
          map: ''
          }
    },
      mounted() {
          this.event();
          this.$nextTick(function() {
            this.tableHeight = this.$refs.tableData.offsetHeight - 50;
            $.ajax({
              url:this.$store.state.api +  "/om/data/stationInfo",
              success: dataResult => {
                var data = dataResult;
                for (var i = 0; i < data.length; i++) {
                  let item = data[i];
                  this.dataArrAll.push({
                    name: item.name,
                    stationId: item.stationId,
                    lastTs: '—/—',
                    status: 0,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    installedCapacity: item.installedCapacity,
                    address: item.address
                  });
                }
                this.getTableData();
                
              },
              error: function(data) {
                alert(data.responseJSON.error);
              }
            });
            
            this.date.initFormatter();
          });
      },
      methods: {
        event(){
          var judge = $("header b");
          var ctx;
          var cas;
          var info = $(".info");
          var list = $(".list");
          var timer;
          var searchInput = $(".search input");
          var infoLeft = $(".info .left");
          var infoPs = $(".info .left p");
          var contList = $(".list .content");
          var objId = {};
          var objName = {};
          var obj;
          var listPs;
          var listFlag = true;
          var listArr;
          var arrTemp = [];
          var listArrTemp = [];
          var listArrLength = 0;
          var flagOne = true;
          var dataResult = [];
          var dataTemp = {};
          var dataArrTemp = [];
          var that = this;
          // 全选,反全选
          var cks = $(".single");
          var ckAll = $(".all");
          cks.prop("checked", true);
          ckAll.prop("checked", true);
          var cklen = cks.length;
          var spans = $(" ul li span");
          var asideP = $(" p");
          ckAll.on("click", function() {
            for (var i = 0; i < cklen; i++) {
              cks[i].checked = this.checked;
            }
          });
          cks.click(function() {
            if ($(".single:checked").length == cks.length) {
              ckAll.prop("checked", true);
            } else {
              ckAll.prop("checked", false);
            }
          });

          var indexHeight = $(".index").height();
          $(".mapBox").css({
            height: indexHeight - 130 + "px",
            width: $(window).width()
          });

          // 报警站点数据
          this.dataArrAlarm = [];
          // 正常站点数据
          this.dataArrNormal = [];
          var dataArrName = [];
          // 所有站点数据
          this.dataArrAll = [];
          var dataObj = {};
          let lastTs;
          

          var alarmCheck = $("ul li .al");
          alarmCheck.on("click", function() {
            var booleanAlarmCheck = $(this).is(":checked");
            var booleanNormalCheck = normalCheck.is(":checked");
            judgeSetMap(booleanAlarmCheck, booleanNormalCheck);
          });
          var normalCheck = $("ul li .nor");
          normalCheck.on("click", function() {
            var booleanNormalCheck = $(this).is(":checked");
            var booleanAlarmCheck = alarmCheck.is(":checked");
            judgeSetMap(booleanAlarmCheck, booleanNormalCheck);
          });
          // 判断的逻辑
          function judgeSetMap(booleanAlarmCheck, booleanNormalCheck) {
            if (booleanAlarmCheck && booleanNormalCheck) {
              that.setGooleMapTable(that.dataArrAll);
            } else if (booleanAlarmCheck) {
              that.setGooleMapTable(that.dataArrAlarm);
              // this.tableData = this.dataArrAlarm
            } else if (booleanNormalCheck) {
              that.setGooleMapTable(that.dataArrNormal);
            } else {
              that.setGooleMapTable([]);
            }
          }
      },
        //创建和初始化地图函数：
        setGooleMapTable(data){
          // var map
          this.map = new BMap.Map("allMap");
          this.map.enableScrollWheelZoom(true);
          this.map.enableKeyboard=true;
          this.map.enableDragging=true;
          this.map.enableDoubleClickZoom=true
          this.map.centerAndZoom(new BMap.Point(110.406808,31.323843),1);
          this.map.setMapStyle({
            styleJson:[
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    saturation: 36
                  },
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [
                  {
                    visibility: "on"
                  },
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 20
                  }
                ]
              },
              {
                featureType: "all",
                elementType: "labels.icon",
                stylers: [
                  {
                    visibility: "off"
                  }
                ]
              },
              {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  },
                  {
                    weight: 1.2
                  }
                ]
              },
              {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  },
                  {
                    weight: 0.2
                  }
                ]
              },
              {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#1F2B37"
                  },
                  {
                    lightness: 1
                  }
                ]
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#131d27"
                  },
                  {
                    lightness: 0
                  }
                ]
              }
            ]
          })
          data.forEach((ele,i) => {
            let item = ele;
            let index = i;
            if(this.infoRender){
              if(data[0].status){
                status = 'Alarm';
              }else{
                status = 'Normal';
              }
            //一开始的默认值
            this.mapName = data[0].name;
            this.mapAdress =
              data[0].latitude.toFixed(3) + "/" + data[0].longitude.toFixed(3);
            this.mapTime = data[0].lastTs;
            this.mapStatus = status;
            this.infoRender = false;
            }

            var iconUrl; // ico图片
            var status;
            var latText = item.latitude.toFixed(3);
            var lngText = item.longitude.toFixed(3);
            // 判断站点状态
            if (item.status == "1") {
              status = "Alarm";
              iconUrl = "../../../../../static/red.svg";
            } else {
              status = "Normal";
              iconUrl = "../../../../../static/green.svg";
            }
              var point = new BMap.Point(data[index].longitude,data[index].latitude);
              var marker;
              marker = new BMap.Marker(point,{icon:new BMap.Icon(iconUrl,new BMap.Size(40,40))});
              marker.addEventListener("click", () => { 
                   this.mapName = data[index].name;
                  this.mapAdress =
                    data[index].latitude.toFixed(3) +
                    "/" +
                    data[index].longitude.toFixed(3);
                  this.mapTime = data[index].lastTs;
                  this.mapStatus = data[index].status ? 'Alarm' : 'Normal';    
                      });
                  this.map.addOverlay(marker);
            if(this.firstRenderMap){
              // var socket = new SockJS( "http://192.168.1.226:8088/websocketServer");
              // let clearTs = '—/—';
              // let stationName = '';
              
              // this.$store.state.stompClient = Stomp.over(socket);
              // let _this = this;
              // this.$store.state.stompClient.connect({}, frame => {
              //   this.$store.state.stompClient.subscribe("/topic/allAlarm", response => {
              //     var data = JSON.parse(response.body);
              //     //table信息订阅
              //     if (Object.keys(data).length != 0) {
              //       var flag = true;
              //       for (var i = 0; i < this.tableData.length; i++) {
              //         if (this.tableData[i].deviceId == data.deviceId) {
              //           if (this.tableData[i].attr == data.attr) {
              //             this.tableData.splice(i, 1);
              //             clearTs = new Date(data.clearTs).Format("yyyy-MM-dd hh:mm:ss");

              //             stationName = data.stationName;
              //             flag = false;
              //           }
              //         }
              //       }
              //       var severityText;
              //       var colorStyle;
              //       if (flag) {
              //         if (data.level != "5") {
              //           if (data.level == "1") {
              //             severityText = "Warning";
              //             colorStyle = "ye";
              //           }
              //           if (data.level == "2") {
              //             severityText = "Fault";
              //             colorStyle = "re";
              //           }
              //           if (data.level == "3") {
              //             severityText = "Offline";
              //             colorStyle = "ol";
              //           }
              //           this.tableData.unshift({
              //             stationName: data.stationName,
              //             deviceName: data.deviceName,
              //             attr: data.attr,
              //             startTs: new Date(data.startTs).Format(
              //               "yyyy-MM-dd hh:mm:ss"
              //             ),
              //             status: data.status,
              //             // colorStyle: colorStyle,
              //             severity: severityText,
              //             deviceId: data.deviceId
              //           });
              //         }
              //       }
              //       let flagStatus;
              //       let startTs = '';
              //       this.dataArrAlarm = [];
              //       this.dataArrNormal = [];
              //       this.dataArrAll.forEach(item => {
              //         flagStatus = true;
              //         this.tableData.forEach(ele => {
              //           if (ele.stationName == item.name) {
              //             flagStatus = false;
              //             startTs = ele.startTs;
              //           }
              //         });
                      
              //         if(item.name == data.stationName){
              //           if (flagStatus) {

              //             item.status = 0;
              //             item.lastTs = clearTs;
              //             if(item.name == this.mapName){
              //               this.mapStatus = 'Normal';
              //             }
        
              //         } else {
              //           item.status = 1;
              //           item.lastTs = startTs
              //           // item.lastTs = new Date(data.startTs).Format(
              //           //     "yyyy-MM-dd hh:mm:ss"
              //           //   )
              //           if(item.name == this.mapName){
              //             this.mapStatus = 'Alarm';
                          
              //           }
                        
              //         }
              //         if(item.name == this.mapName){
              //             this.mapTime = item.lastTs; 
              //           }
                                  
                          
              //         } 
              //         if (flagStatus) {
              //           item.status = 0;
              //           this.dataArrNormal.push(item);
              //         } else {
              //           item.status = 1;
              //           this.dataArrAlarm.push(item);
              //         }
              //       });
              //       this.setGooleMapTable(this.dataArrAll);  
              //     }
              //   });
              // });
              // function disconnect() {
              //         if (this.$store.state.stompClient != null) {
              //             this.$store.state.stompClient.disconnect();
              //         }
              //         console.log('disconnect')
              // }

              this.firstRenderMap = false;
        
            }
          })
        },
        getTableData() {
          //table数据接口
          // this.tableData = []
          this.$axios
            .get(this.$store.state.api +  "/om/data/allALarm")
            .then(response => {
                var severityText;
                var colorStyle;
                for (var i = 0; i < response.data.length; i++) {
                  severityText = '';
                  colorStyle = '';
                  if(response.data[i].level != '5') {
                    if (response.data[i].level == "1") {
                      severityText = "Warning";
                      colorStyle = "yellow";
                    }
                    if (response.data[i].level == "2") {
                      severityText = "Fault";
                      colorStyle = "re";
                    }
                    if (response.data[i].level == "3") {
                      severityText = "Offline";
                      colorStyle = "ol";
                    }
                    if (response.data.length != 0) {
                      this.lastStartTs = new Date(response.data[i].startTs).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      );
                    }else{
                      this.lastStartTs = '—/—'
                    }
    
                    this.tableData.push({
                      stationName: response.data[i].stationName,
                      deviceName: response.data[i].deviceName,
                      attr: response.data[i].attr,
                      startTs: new Date(response.data[i].startTs).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      ),
                      status: response.data[i].status,
                      colorStyle: colorStyle,
                      severity: severityText,
                      deviceId: response.data[i].deviceId
                    });
                  }
          
                }
                
                let flagStatus;
                let startTs = '';
                this.dataArrAlarm = [];
                this.dataArrNormal = [];
                this.dataArrAll.forEach(item => {
                  flagStatus = true;
                  this.tableData.forEach(ele => {
                    if (ele.stationName == item.name) {
                      flagStatus = false;
                      startTs = ele.startTs;
                    }
                  });
                  if (flagStatus) {
                    item.status = 0;
                    this.dataArrNormal.push(item);
                  } else {
                    item.status = 1;
                    this.dataArrAlarm.push(item);
                  }
                  // if(item.name == stationName){
                    if (flagStatus) {
                      item.lastTs = '—/—';
                    } else {
                      item.status = 1;
                      item.lastTs = startTs;
                    }                     
                  // } 
                });
                //拿到时间,开始画图
                this.setGooleMapTable(this.dataArrAll);
            });
        }
    }
}
</script>

<style lang="stylus">
.BMap_cpyCtrl.BMap_noprint.anchorBL{
  display none
}
img[src='https://api.map.baidu.com/images/copyright_logo.png'] {
  opacity: 0;
}
img[src='http://api0.map.bdimg.com/images/copyright_logo.png'] {
  opacity: 0;
}
div[title='显示卫星影像']{
  display none
}
div[title='显示三维地图']{
  display none
}
.asset {
  width: 100%;
  height: 60%;
  background: #Fff;
  overflow: hidden;
  font-weight: normal;
}

.asset #left {
  width: 80%;
  height: 100%;
  border-right: 1px solid #eee;
  float: left;
  position: relative;
}

.asset #left ul li {
  padding: 0;
  line-height: 35px;
  float: left;
  margin-right: 20px;
}

.asset #left #allMap {
  width: 100%;
  height: 90%;
}

.asset #left .name {
  position: absolute;
  left: 20px;
  font-size: 2.2rem;
  font-weight: normal;
  z-index: 999;
  top: 50%;
  transform: translateY(-50%);
}

.asset #left .selectType {
  position: absolute;
  // top: 20px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.asset .right {
  width: 20%;
  height: 100%;
  float: right;
  background-color: #FAFBFC;

  .dressTop {
    height: 60%;
    width: 100%;
    border-bottom: 1px solid #eee;
    padding: 20px;

    .university {
      font-size: 1rem;
      font-weight: bold;
      line-height: 2.5rem;
    }
  }

  .dressBottom {
    padding: 20px;
    height: 40%;

    p {
      margin: 10px 0;
      font-size: 12px;
      font-weight: bold;
    }
  }
}

.alarmTable {
  background-color: #fff;
  border-radius: 5px;
  font-weight: normal;
  height: 38%;
  overflow: auto;

  .tableName {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background-color: #F8F9FC;
    padding-left: 30px;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }

  .assettext {
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: normal;
    color: #000;
  }

  .assettext1 {
    height: 20px;
    line-height: 20px;
    color: gray;
    font-size: 14px;
    font-weight: normal;
  }

  .circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    left: 28px;
    top: 28px;
  }
}

// .clearfix::before,.clearfix::after
// content:"";
// height:0;
// line-height:0;
// display:block;
// visibility:hidden;
// clear:both;

// .clearfix
// *zoom:1;/*IE/7/6*/

// .product section.selectSection ul li
// float left
.gmnoprint {
  display: none;
}

element.style {
  background: none rgb(255, 255, 255);
  border: 0px;
  margin: 10px;
  padding: 0px;
  position: absolute;
  cursor: pointer;
  user-select: none;
  border-radius: 2px;
  height: 40px;
  width: 40px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  overflow: hidden;
  top: 0px;
  right: 0px;
}

button.gm-control-active.gm-fullscreen-control {
  background: none rgba(0, 0, 0, 0) !important;
}

input.single {
  width: 17px;
  height: 17px;
}

img[src='../../../../../static/red.svg'] {
  animation: move 2s linear infinite;
}

img[src='../../../../../static/green.svg'] {
  animation: move 2s linear infinite;
}

@keyframes move {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.7);
  }

  100% {
    transform: scale(1);
  }
}
</style>
