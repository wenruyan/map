<template>
  <div class="historyAlarm" style="height:100%" ref="maxBox">
    <div class="alarmtop clearfix" ref="alarmTop">
      <div class="select">
        <span>Station Name:</span>
        <Select :style="{width:$store.state.selectWidth}" v-model="stationModel" @on-change="selectStation">
          <Option v-for="item in stationList" :value="item.stationId" :key="item.stationId">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="select">
        <span>Device Name:</span>
        <Select v-model="devModel" :style="{width:$store.state.selectWidth}" @on-change="selectDevice">
          <Option v-for="item in deviceList" :value="item.deviceId" :key="item.deviceId">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="select">
        <span>Param Name:</span>
        <Select @on-change="paramSelect" v-model="paramModel" :style="{width:$store.state.selectWidth}" placeholder="please select">
          <Option v-for="item in paramList" :value="item.name" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="select">
        <span>Start Time:</span>
        <DatePicker :editable="false" :options="startOptions" :value='startTime' @on-change=selectStartTime type="datetime" format="yyyy-MM-dd HH:mm" placeholder="start time" :style="{width:$store.state.selectWidth}"></DatePicker>
      </div>
      <div class="select">
        <span>End Time:</span>
        <DatePicker :editable="false" :options="endOptions" :value="endTime" @on-change=selectEndTime type="datetime" format="yyyy-MM-dd HH:mm" placeholder="end time" :style="{width:$store.state.selectWidth}"></DatePicker>
      </div>
      <div class="select">
        <span>Severity:</span>
        <Select v-model="levelModel" :style="{width:$store.state.selectWidth}" @on-change="levelSelect">
          <Option v-for="item in arrType" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </div>
      <div class="select">
        <Button type="primary" @click="confirm">Confirm</Button>
      </div>

    </div>
    <div class="alarmtable" :style="{height: alarmtableHeight+'px'}">
      <Table :columns="columns" :data="tabelData" :height='alarmtableHeight'></Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stationList: [],
      stationModel: "",
      deviceList: [],
      getStationId: "",
      deviceName: "",
      devModel: "",
      getDeviceId: "",
      paramList: [],
      paramArr: [],
      paramModel: "",
      startTime: "",
      endTime: "",
      getEndTime: "",
      getStartTime: "",
      name: "",
      tabelData: [],
      alarmtableHeight: 0,
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
      arrType: [],
      levelModel: "",
      columns: [
        {
          title: "Station Name",
          key: "stationName",
          // width:300,
          align: "center"
        },
        {
          title: "Device Name",
          key: "deviceName",
          align: "center"
          // width:200
        },
        {
          title: "Param Name",
          key: "attr",
          align: "center"
          // width:250
        },
        {
          title: "Start Time",
          key: "startTs",
          align: "center",
          // "sortable": true,
          sortType: "desc",
          render: (h, params) => {
            return h(
              "div",
              new Date(params.row.startTs).Format("yyyy-MM-dd hh:mm")
            );
          }
        },
        {
          title: "End Time",
          key: "clearTs",
          align: "center",
          // sortable: true,
          // width:200,
          render: (h, params) => {
            if (params.row.clearTs) {
              return h(
                "div",
                new Date(params.row.clearTs).Format("yyyy-MM-dd hh:mm")
              );
            }
            if (!params.row.clearTs) {
              return h("div", new Date(params.row.clearTs).Format("-/-"));
            }
          }
        },
        {
          title: "Status",
          key: "status",
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
          key: "level",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    //获取站点
    this.getStation();
    this.getDevice();
    this.getTime();
    this.getLevel();
    this.date.initFormatter();
    this.alarmtableHeight =
      this.$refs.maxBox.offsetHeight - this.$refs.alarmTop.offsetHeight;
  },
  methods: {
    confirm() {
      this.getTabel();
    },
    levelSelect(value) {
      this.levelModel = value;
    },
    getLevel() {
      this.arrType = ["All", "Warning", "Fault", "Offline", "Status"];
      this.levelModel = "All";
    },
    getStation() {
      this.$axios
        .get(this.$store.state.api + "/om/data/stationInfo")
        .then(response => {
          this.stationList = response.data;
          for (var i = 0; i < response.data.length; i++) {
            this.stationName = response.data[i].stationId;
          }
          this.stationModel = this.stationList[0]["stationId"];
        });
    },
    selectStation(value) {
      this.stationName = value;
      this.getStationId = value;
      this.$axios
        .get(this.$store.state.api + "/om/data/deviceList")
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.deviceName = response.data[i].stationId;

            if (this.stationName == this.deviceName) {
              this.deviceList = response.data[i].deviceList;
              if (this.deviceList.length == 0) {
                this.devModel = "";
              } else {
                this.devModel = this.deviceList[0]["deviceId"];
                this.getDeviceId = this.deviceList[0]["deviceId"];
                this.getStationId = response.data[i]["stationId"];
                this.getParam();
                this.getTime();
              }
            }
          }
        });
    },
    getDevice() {
      this.$axios
        .get(this.$store.state.api + "/om/data/deviceList")
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            this.deviceName = response.data[0].stationId;
            this.stationName = response.data[0].stationId;
            this.getStationId = response.data[0]["stationId"];
          }
          if (this.stationName == this.deviceName) {
            this.deviceList = response.data[0].deviceList;
            this.devModel = this.deviceList[0]["deviceId"];
            this.getDeviceId = this.deviceList[0]["deviceId"];
            this.getParam();

            // this.getTabel()
          }
        });
    },
    getParam() {
      this.$axios
        .get(this.$store.state.api + "/om/data/telesignal/" + this.getDeviceId)
        .then(response => {
          this.paramList = response.data;
          if (response.data.length != 0) {
            let arr = this.paramList.unshift({ name: "All" });
            let arrLength = response.data.slice(1);
            this.paramModel = this.paramList[0]["name"];
            this.name = this.paramModel;
            this.getTabel();
          } else {
            this.paramModel = " ";
            this.name = this.paramModel;
            this.getTabel();
          }
        });
    },
    selectDevice(value) {
      this.getDeviceId = value;
      this.getParam();
      this.getTime();
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
    paramSelect(value) {
      this.name = value;
    },
    getTabel() {
      var level;
      let allUrl;
      if (this.name == "All" && this.levelModel == "All") {
        allUrl =
          this.$store.state.api + 
          "/om/data/findAlarmHistory" +
          "?stationId=" +
          this.getStationId +
          "&deviceId=" +
          this.getDeviceId +
          "&startTs=" +
          this.getStartTime +
          "&endTs=" +
          this.getEndTime;
        this.$axios.get(allUrl).then(response => {
          this.tabelData = response.data.slice(
            response.data.length - 100,
            response.data.length
          );
          for (var i = 0; i < this.tabelData.length; i++) {
            if (this.tabelData[i].level == 1) {
              this.tabelData[i].level = "Warning";
            }
            if (this.tabelData[i].level == 2) {
              this.tabelData[i].level = "Fault";
            }
            if (this.tabelData[i].level == 3) {
              this.tabelData[i].level = "Offline";
            }
            if (this.tabelData[i].level == 5) {
              this.tabelData[i].level = "Status";
            }
          }
        });
      }
      if (this.name != "All" && this.levelModel == "All") {
        allUrl =
          this.$store.state.api + 
          "/om/data/findAlarmHistory" +
          "?stationId=" +
          this.getStationId +
          "&deviceId=" +
          this.getDeviceId +
          "&attr=" +
          this.name +
          "&startTs=" +
          this.getStartTime +
          "&endTs=" +
          this.getEndTime;
        this.$axios.get(allUrl).then(response => {
          this.tabelData = response.data.slice(
            response.data.length - 100,
            response.data.length
          );
          if (response.data.length != 0) {
            for (var i = 0; i < this.tabelData.length; i++) {
              if (this.tabelData[i].level == 1) {
                this.tabelData[i].level = "Warning";
              }
              if (this.tabelData[i].level == 2) {
                this.tabelData[i].level = "Fault";
              }
              if (this.tabelData[i].level == 3) {
                this.tabelData[i].level = "Offline";
              }
              if (this.tabelData[i].level == 5) {
                this.tabelData[i].level = "Status";
              }
            }
          } else {
          }
        });
      }
      if (this.levelModel != "All" && this.name != "All") {
        if (this.levelModel == "Warning") {
          level = "1";
        }
        if (this.levelModel == "Fault") {
          level = "2";
        }
        if (this.levelModel == "Offline") {
          level = "3";
        }
        if (this.levelModel == "Status") {
          level = "5";
        }
        allUrl =
          this.$store.state.api + 
          "/om/data/findAlarmHistory" +
          "?stationId=" +
          this.getStationId +
          "&deviceId=" +
          this.getDeviceId +
          "&attr=" +
          this.name +
          "&startTs=" +
          this.getStartTime +
          "&endTs=" +
          this.getEndTime +
          "&level=" +
          level;
        this.$axios.get(allUrl).then(response => {
          this.tabelData = response.data.slice(
            response.data.length - 100,
            response.data.length
          );
          for (var i = 0; i < this.tabelData.length; i++) {
            if (this.tabelData[i].level == 1) {
              this.tabelData[i].level = "Warning";
            }
            if (this.tabelData[i].level == 2) {
              this.tabelData[i].level = "Fault";
            }
            if (this.tabelData[i].level == 3) {
              this.tabelData[i].level = "Offline";
            }
            if (this.tabelData[i].level == 5) {
              this.tabelData[i].level = "Status";
            }
          }
        });
      }
      if (this.levelModel != "All" && this.name == "All") {
        if (this.levelModel == "Warning") {
          level = "1";
        }
        if (this.levelModel == "Fault") {
          level = "2";
        }
        if (this.levelModel == "Offline") {
          level = "3";
        }
        if (this.levelModel == "Status") {
          level = "5";
        }
        allUrl =
          this.$store.state.api + 
          "/om/data/findAlarmHistory" +
          "?stationId=" +
          this.getStationId +
          "&deviceId=" +
          this.getDeviceId +
          "&startTs=" +
          this.getStartTime +
          "&endTs=" +
          this.getEndTime +
          "&level=" +
          level;
        this.$axios.get(allUrl).then(response => {
          this.tabelData = response.data.slice(
            response.data.length - 100,
            response.data.length
          );
          for (var i = 0; i < this.tabelData.length; i++) {
            if (this.tabelData[i].level == 1) {
              this.tabelData[i].level = "Warning";
            }
            if (this.tabelData[i].level == 2) {
              this.tabelData[i].level = "Fault";
            }
            if (this.tabelData[i].level == 3) {
              this.tabelData[i].level = "Offline";
            }
            if (this.tabelData[i].level == 5) {
              this.tabelData[i].level = "Status";
            }
          }
        });
      }
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
          that.alarmtableHeight =
            that.$refs.maxBox.offsetHeight - that.$refs.alarmTop.offsetHeight;
          // that.myChart.resize();
        }, 400);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.historyAlarm {
  font-weight: normal;
}

.alarmtop {
  width: 100%;
  line-height: 60px;
  background: #fff;
  font-size: 15px;
  padding-left: 20px;
}

.select span {
  width: 110px;
  display: inline-block;
}

.alarmtime {
  width: 100%;
  line-height: 60px;
  background: #fff;
  font-size: 15px;
  border-bottom: 1px solid #eee;
}

.alarmtable {
  width: 100%;
  background: #fff;
}

.ivu-table-wrapper {
  border: none;
}

.ivu-table:before {
  height: 0;
}

.ivu-table:after {
  width: 0;
}

.ivu-table td {
  border-bottom: none;
}

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
</style>
