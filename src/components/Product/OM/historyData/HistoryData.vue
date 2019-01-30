<template>
  <div class="historydata" style="height:100%" ref="maxBox">
    <div class="historytop clearfix" ref="historytop">
      <div class="select">
        <span>Station Name:</span>
        <Select :style="{width:$store.state.selectWidth}" v-model="stationModel" @on-change="selectStation" style="margin-right:30px">
          <Option v-for="item in stationList" :value="item.stationId" :key="item.stationId">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="select">
        <span>Device Name:</span>
        <Select v-model="devModel" :style="{width:$store.state.selectWidth}" @on-change="selectDevice" style="margin-right:30px">
          <Option v-for="item in deviceList" :value="item.deviceId" :key="item.deviceId">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="select">
        <span>Param Name:</span>
        <el-select @change="paramSelect" multiple collapse-tags v-model="paramModel" no-data-text="No matching data" placeholder="please select" style="width:230px;margin-right:30px">
          <el-option v-for="item in paramList" :value="item.name" :key="item.value">{{ item.name }}</el-option>
        </el-select>
      </div>

      <div class="select">
        <span>Start Time:</span>
        <DatePicker :editable="false" :options="startOptions" :value='startTime' @on-change=selectStartTime type="datetime" format="yyyy-MM-dd HH:mm" placeholder="start time" :style="{width:$store.state.selectWidth,marginRight: '30px'}"></DatePicker>
      </div>
      <div class="select">
        <span>End Time:</span>
        <DatePicker :editable="false" :options="endOptions" :value="endTime" @on-change=selectEndTime type="datetime" format="yyyy-MM-dd HH:mm" placeholder="end time" :style="{width:$store.state.selectWidth,marginRight: '30px'}"></DatePicker>
      </div>
      <div class="select">
        <span>Interval:</span>
        <Select v-model="intervalModel" :style="{width:$store.state.selectWidth,marginRight: '30px'}">
          <Option v-for="item in intervalList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </div>
      <div class="select">
        <Button type="primary" @click="confirm">Confirm</Button>
      </div>
    </div>
    <div class="historyechart" :style="{height: historyechartHeight+'px'}">
      <div id="echart" :style="{height: historyechartHeight+'px'}"></div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      unit: "",
      unit1: "",
      unitArr: [],
      legendName: [],
      resultArr: {},
      xAxisArr: [],
      yAxisArr1: [],
      yAxisArr2: [],
      stationList: [],
      stationName: "",
      stationModel: "",
      deviceList: [],
      deviceName: "",
      devModel: "",
      getDeviceId: "",
      paramList: [],
      paramArr: [],
      paramModel: [],
      startTime: "",
      endTime: "",
      getEndTime: "",
      getStartTime: "",
      dayDiff: "",
      intervalList: [],
      intervalModel: "",
      name: "",
      arr: [],
      colorArr: [],
      startOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      endOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      myChart: "",
      historyechartHeight: 0
    };
  },
  mounted() {
    //获取站点
    this.getStation();
    this.getDevice();
    this.getTime();
    this.intervalTime();
    this.date.initFormatter();
    this.historyechartHeight =
      this.$refs.maxBox.offsetHeight - this.$refs.historytop.offsetHeight;
  },
  methods: {
    bb() {
      function timestampToTime(timestamp, flag, flagTwo, flagThree) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var m =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        if (flag) {
          return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
        }
        if (flagTwo) {
          return h + ":" + m + ":" + s;
        }
        if (flagThree) {
          return M + "-" + D + " " + h + ":" + m;
        }
        return h + ":" + m + "-" + M + "-" + D;
      }
      // 获取二维数组中的最大值
      function getMax(data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
          let item = data[i];
          result.push(+item[1]);
        }
        // data.forEach(function(item,index){
        //     result.push(+item[1]);
        // })
        return Math.max.apply(null, result);
      }
      // 获取二维数组中的最小值
      function getMin(data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
          let item = data[i];
          result.push(+item[1]);
        }
        // data.forEach(function(item,index){
        //     result.push(+item[1]);
        // })
        return Math.min.apply(null, result);
      }
      var dataX = [];
      var dataArr = [];
      var seriesData = [];
      // var timeChart =  this.$echarts.init(document.getElementById('echart'));
      var interval;
      var intervalVal = this.intervalModel;
      if (intervalVal.indexOf("s") != -1) {
        interval = +intervalVal.replace("s", "") + "000";
      }
      if (intervalVal.indexOf("min") != -1) {
        interval = +intervalVal.replace("min", "") * 60 + "000";
      }
      if (intervalVal.indexOf("hour") != -1) {
        interval = +intervalVal.replace("hour", "") * 60 * 60 + "000";
      }
      if (intervalVal.indexOf("day") != -1) {
        interval = +intervalVal.replace("day", "") * 60 * 60 * 24 + "000";
      }
      this.colorArr = ["#4bc4ff", "#50e3c2", "#fd944a", "#fbfc7f", "#fa57fd"];
      var dataTemp = [];
      var nameObj = {};
      var colorStr;
      for (var i = 0; i < this.name.length; i++) {
        let item = this.name[i];

        // let that = this
        //echarts数据获取
        this.$axios
          .get(
              this.$store.state.api + 
              "/om/data/historyData/" +
              this.getDeviceId +
              "?keys=" +
              item +
              "&startTs=" +
              this.getStartTime +
              "&endTs=" +
              this.getEndTime +
              "&agg=AVG&interval=" +
              interval +
              "&limit=" +
              1000000
          )
          .then(response => {
            var dataResult = response.data.result;
            //此接口是为了拿到unit单位
            this.$axios
              .get(
                  this.$store.state.api + 
                  "/om/data/findUnitByDevice/" +
                  "?deviceId=" +
                  this.getDeviceId +
                  "&params=" +
                  item
              )
              .then(response => {
                let arr = [];
                var dataPGF = [];
                var maxPGF = "";
                var minPGF = "";
                let obj = response.data;
                for (let i in obj) {
                  arr.push(obj[i]);
                  this.unit1 = arr[0];

                  var valueTemp;
                  let a = [];
                  let b = [];
                  dataTemp = [];
                  let dataResultArr;
                  for (var i = 0; i < this.name.length; i++) {
                    let item = this.name[i];
                  }
                  for (var i = 0; i < dataResult[item].length; i++) {
                    dataResultArr = dataResult[item][i];
                    dataPGF.push(dataResult[item][i]["value"]);
                    dataResultArr["unit"] = this.unit1;
                    // maxPGF = Math.max.apply(null, dataPGF);
                  }
                  minPGF = Math.min.apply(null, dataPGF);
                  maxPGF = Math.max.apply(null, dataPGF);
                  // console.log(maxPGF)
                  if (dataResultArr.unit != "/") {
                    this.unit = dataResultArr.unit;
                  }
                  if (dataResultArr.unit == "/") {
                    this.unit = "";
                  }
                  for (var j = 0; j < dataResult[item].length; j++) {
                    let item1 = dataResult[item][j];
                    valueTemp = item1.value;
                    if (item1.value.indexOf(".") != -1) {
                      if (item1.value.split(".")[1].length > 3) {
                        valueTemp = (+item1.value).toFixed(3);
                      }
                    }
                    dataTemp.push([
                      timestampToTime(item1.ts, true, false, false),
                      valueTemp,
                      this.unit
                    ]);
                  }

                  nameObj[item] = dataTemp;
                  dataArr.push(dataTemp);
                  if (Object.keys(nameObj).length == this.name.length) {
                    for (var k in nameObj) {
                      for (var a = 0; a < this.name.length; a++) {
                        let item2 = this.name[a];
                        let index = a;
                        if (item2 == k) {
                          colorStr = this.colorArr[a];
                          var series = {
                            smooth: true,
                            name: k,
                            type: "line",
                            smooth: true,
                            data: nameObj[k].reverse(),
                            lineStyle: {
                              normal: {
                                color: colorStr
                              }
                            },
                            itemStyle: {
                              normal: {
                                color: colorStr,
                                shadowColor: "rgba(255,255,255,.6)",
                                shadowBlur: 20
                              }
                            }
                          };
                          seriesData.push(series);
                        }
                      }
                    }
                  }

                  //  drawTimeEchart(name, data, dataX, maxX, minX)
                }

                this.drawTimeEchart(
                  this.name,
                  seriesData,
                  maxPGF,
                  minPGF,
                  dataX.reverse(),
                  this.getEndTime,
                  this.getStartTime
                );
              });
          });
      }
    },
    confirm() {
      this.bb();
    },
    intervalTime() {
      this.intervalList = ["5min", "10min", "15min", "30min", "1hour", "2hour"];
      this.intervalModel = this.intervalList[0];
    },
    selectEndTime(value) {
      if (value.split(" ")[1] !== "00:00") {
        this.endTime = value.split(" ")[0] + " " + value.split(" ")[1];
      } else {
        this.endTime = value.split(" ")[0] + " " + this.endTime.split(" ")[1];
      }

      this.getEndTime = new Date(this.endTime.replace(/-/g, "/")).getTime();
      this.getStartTime = new Date(this.startTime.replace(/-/g, "/")).getTime();
      this.commonTime(this.getEndTime, this.getStartTime);
    },

    selectStartTime(value) {
      this.startTime = value;
      this.getEndTime = new Date(this.endTime.replace(/-/g, "/")).getTime();
      this.getStartTime = new Date(this.startTime.replace(/-/g, "/")).getTime();
      this.commonTime(this.getEndTime, this.getStartTime);
    },
    commonTime(startDate, endDate) {
      var dateDiff = this.getEndTime - this.getStartTime; //时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
      this.arr = [dayDiff, hours, minutes];
      if (dateDiff <= 0) {
        this.$Message.success({
          content: "Please check current end time",
          duration: 3
        });
      } else {
        if (this.arr[0] < 1) {
          if (this.arr[1] < 1) {
            if (this.arr[2] <= 9) {
              this.intervalList = ["1s", "5s", "10s", "15s", "30s"];
              this.intervalModel = this.intervalList[0];
            } else if (this.arr[2] <= 59) {
              this.intervalList = ["5s", "10s", "15s", "30s", "1min"];
              this.intervalModel = this.intervalList[0];
            }
          } else if (this.arr[1] <= 9) {
            this.intervalList = ["10s", "15s", "30s", "1min", "2min"];
            this.intervalModel = this.intervalList[0];
          } else if (this.arr[1] <= 23) {
            this.intervalList = [
              "2min",
              "5min",
              "10min",
              "15min",
              "30min",
              "1hour"
            ];
            this.intervalModel = this.intervalList[0];
          }
        } else if (this.arr[0] == 1) {
          this.intervalList = [
            "5min",
            "10min",
            "15min",
            "30min",
            "1hour",
            "2hour"
          ];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 3) {
          this.intervalList = ["10min", "15min", "30min", "1hour", "2hour"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 5) {
          this.intervalList = ["15min", "30min", "1hour", "2hour", "5hour"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 10) {
          this.intervalList = [
            "30min",
            "1hour",
            "2hour",
            "5hour",
            "10hour",
            "12hour"
          ];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 20) {
          this.intervalList = [
            "1hour",
            "2hour",
            "5hour",
            "10hour",
            "12hour",
            "1day"
          ];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 40) {
          this.intervalList = ["2hour", "5hour", "10hour", "12hour", "1day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 69) {
          this.intervalList = ["5hour", "10hour", "12hour", "1day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 104) {
          this.intervalList = ["5hour", "10hour", "12hour", "1day", "7day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 204) {
          this.intervalList = ["10hour", "12hour", "1day", "7day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 297) {
          this.intervalList = ["12hour", "1day", "7day", "30day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 554) {
          this.intervalList = ["1day", "7day", "30day"];
          this.intervalModel = this.intervalList[0];
        } else if (this.arr[0] <= 3495) {
          this.intervalList = ["7day", "30day"];
          this.intervalModel = this.intervalList[0];
        } else {
          this.intervalList = ["30day"];
          this.intervalModel = this.intervalList[0];
        }
      }
    },
    getStation() {
      this.$axios
        .get(this.$store.state.api +  "/om/data/stationInfo")
        .then(response => {
          this.stationList = response.data;
          for (var i = 0; i < response.data.length; i++) {
            this.stationName = response.data[i].stationId;
          }
          this.stationModel = this.stationList[0]["stationId"];
        });
    },
    getDevice() {
      this.$axios
        .get(this.$store.state.api + "/om/data/deviceList")
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.deviceName = response.data[0].stationId;
            this.stationName = response.data[0].stationId;
            if (this.deviceName == this.stationName) {
              this.deviceList = response.data[0].deviceList;
              this.devModel = this.deviceList[0]["deviceId"];
              this.getDeviceId = this.deviceList[0]["deviceId"];
            }
          }
          this.getParam();
        });
    },
    selectStation(value) {
      this.stationName = value;
      this.$axios
        .get(this.$store.state.api +  "/om/data/deviceList")
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.deviceName = response.data[i].stationId;
            if (this.stationName == this.deviceName) {
              this.deviceList = response.data[i].deviceList;
              if (this.deviceList.length == 0) {
                this.devModel = "";
                this.getParam();
              } else {
                this.devModel = this.deviceList[0]["deviceId"];
                this.getDeviceId = this.deviceList[0]["deviceId"];
                // this.getStationId = response.data[i]['stationId']
                this.getParam();
                this.getTime();
              }
            }
          }
        });
    },
    selectDevice(value) {
      this.getDeviceId = value;
      this.getParam();
      this.getTime();
    },
    paramSelect(value) {
      this.name = value;
    },
    //获取参数
    getParam() {
      // paramList
      this.$axios
        .get(
            this.$store.state.api + 
            "/om/data/readOnlyTelemeter/" +
            this.getDeviceId
        )
        .then(response => {
          if (response.data.length != 0) {
            this.paramList = response.data;
            this.paramModel = this.paramList[0]["name"].split(",");
            this.name = this.paramModel;
            this.bb();
          } else {
            this.paramModel = "";
            this.name = this.paramModel;
            this.bb();
          }
        });
    },
    getTime() {
      function getNowFormatDate(flag) {
        var date = new Date();
        // 获取当前日期前一天
        if (flag) {
          date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
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
      // 获取当前时间（时分秒）
      function getNow(flag) {
        var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var m =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        if (flag) {
          return h + ":" + m;
        }
        return h + ":" + m + ":" + s;
      }

      this.startTime = getNowFormatDate(true) + " 00:00";
      this.endTime = getNowFormatDate() + " " + getNow(true);
      this.getEndTime = new Date(this.endTime.replace(/-/g, "/")).getTime();
      this.getStartTime = new Date(this.startTime.replace(/-/g, "/")).getTime();
    },

    drawTimeEchart(name, data, minY, maxY, dataX, maxX, minX) {
      var colorArr = ["#4bc4ff", "#50e3c2", "#fd944a", "#fbfc7f", "#fa57fd"];
      let chart = document.getElementById("echart");
      chart.removeAttribute("_echarts_instance_"); //清除之前的echarts
      this.myChart = this.$echarts.init(chart);
      var option = {
        color: this.colorArr,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              backgroundColor: "#6a7985"
            }
          },
          formatter: function(params) {
            if (params.length > 1) {
              var returnData = "";
              returnData += params[0].value[0];
              for (let g in params) {
                returnData +=
                  "<br/>" +
                  '<i style="display:inline-block;margin-right:5px;width:8px;height:8px;border-radius:50%;background-color: ' +
                  params[g].color +
                  ';"></i>' +
                  params[g].seriesName +
                  "  :  " +
                  params[g].value[1] +
                  params[g].value[2];
              }
              return returnData;
            } else {
              return (
                params[0].value[0] +
                " <br/>" +
                '<i style="display:inline-block;margin-right:5px;width:8px;height:8px;border-radius:50%;background-color: ' +
                colorArr[0] +
                ';"></i>' +
                params[0].seriesName +
                "  :  " +
                params[0].value[1] +
                params[0].value[2]
              );
            }
          }
        },
        legend: {
          show: true,
          data: name,
          y: "5%",
          x: "center",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 2,
          itemGap: 13,
          textStyle: {
            fontSize: 12,
            //   color: 'rgba(255,255,255,0.35)',
            fontFamily: "exoDemiBold"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLabel: {
            color: "#3aa6fe"
          },
          max: maxX,
          min: minX,
          show: false
        },
        yAxis: {
          type: "value",
          // min:0,
          // max:maxY,
          axisLabel: {
            color: "#3aa6fe"
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#214b6b"
            }
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            start: 80,
            end: 100,
            handleSize: 20,
            bottom: "0",
            color: "#3aa6fe",
            fillerColor: "rgba(63,168,244,.3)",
            borderColor: "rgba(63,168,244,.3)",
            textStyle: {
              color: this.colorArr[0]
            }
          }
        ],
        series: data
      };
      this.myChart.setOption(option);
      //   }
    }
  },
  computed: {
    selectSectionWidth() {
      return this.$store.state.selectSectionWidth;
    }
  },
  watch: {
    selectSectionWidth() {
      let that = this;
      if (!this.timer) {
        this.timer = true;
        setTimeout(function() {
          that.timer = false;
          that.historyechartHeight =
            that.$refs.maxBox.offsetHeight - that.$refs.historytop.offsetHeight;
          that.myChart.resize();
        }, 400);
      }
    }
  }
};
</script>

<style  lang="stylus">
.clearfix:before, .clearfix:after {
  content: '';
  display: block;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.select {
  float: left;
  height: 60px;
  width: 410px;
}

.select>span {
  width: 110px;
  display: inline-block;
}

.el-select__tags-text {
  max-width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}

.el-select {
  .el-select__tags {
    .el-tag {
      margin-bottom: 0;

      .el-tag__close {
        top: -2px;
      }
    }
  }
}

.historydata {
  font-weight: normal;

  .ivu-col> {
    span {
      display: inline-block;
      width: 105px;
    }
  }
}

.historytop {
  width: 100%;
  padding-left: 20px;
  line-height: 60px;
  background: #fff;
  font-size: 15px;
}

.historytime {
  width: 100%;
  height: 10%;
  padding-left: 20px;
  line-height: 60px;
  background: #fff;
  font-size: 15px;
  border-bottom: 1px solid #eee;
}

.historyechart {
  width: 100%;
  height: 80%;
  // background: #fff;
  background: #fff;

  // padding-top 30px
  #echart {
    width: 80%;
    // height: 600px;
  }
}

.el-input__inner {
  height: 30px;
  line-height: 30px;
}

.el-select__tags {
  height: 30px;
}
</style>
