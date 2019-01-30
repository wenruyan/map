<template>
    <div class="readTimeData" style="height:100%">
        <transition name="slide-fade">
            <div class="showbox"  v-show="show">
                <div class="showModal">
                    <div @click='closeShow' class="icon">
                        <Icon type="md-close" />
                    </div>
                    <div class="showName">
                        <Row>
                            <Col span="14" style="padding-left:24px">Measurement information</Col>
                            <Col span="10">Signal condition</Col>
                        </Row>   
                    </div>
                    <div class="showleft">
                        <Table height="700" :columns="columns1" :data="tableData1"></Table>
                    </div>
                    <div class="showright">
                        <Table :columns="columns2" :data="tableData2"></Table>
                    </div>
                </div>
            </div>
        </transition>
        <div class="readtop">
                <div class="selectSN tvc" style="left:30px">
                    Station Name:
                    <Select :style="{width:$store.state.selectWidth}" v-model="stationModel" @on-change="selectStation" style="margin-left:5px">
                        <Option v-for="item in stationList" :value="item.stationId"  :key="item.stationId">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="selectDN tvc" style="left:300px">
Device Name:
                    <Select v-model="devModel" :style="{width:$store.state.selectWidth}" @on-change="selectDevice" style="margin-left:5px">
                        <Option v-for="item in deviceList" :value="item.deviceId" :key="item.deviceId">{{ item.name }}</Option>
                    </Select>
                </div>
                
                <div class="tvc" style="right:30px;width:140px">
                  <div class="circle tvc" :style="{background:bgColor}" ></div>
                  <span  @click="show = !show" class="fr" style="text-decoration:underline;cursor:pointer">System status</span> 
                </div>
                  
        </div>
        <div style="height:10%"></div>
        <div class="readcenter">
            <Row type="flex" style="height:100%">
                <Col span="5" order="1" style="border-right:1px solid #eee">
                    <div class="readtext">
                        <p>{{this.Grid_Status}}</p>
                    </div>
                    <div class="readtext1">
                      <p>GRID STATUS</p>
                    </div>
                </Col>
                <Col span="5" order="2" style="border-right:1px solid #eee">
                    <div class="readtext">
                        <p>{{this.Active_Power}}</p>
                    </div>
                    <div class="readtext1">
                      <p>ACTIVE POWER</p>
                    </div>
                </Col>
                <Col span="5" order="3" style="border-right:1px solid #eee">
                    <div class="readtext">
                        <p>{{this.Batter_Soc}}</p>
                    </div>
                    <div class="readtext1">
                      <p>BATTERY SOC</p>
                    </div>
                </Col>
                <Col span="5" order="4" style="border-right:1px solid #eee">
                    <div class="readtext">
                        <p>{{this.soh}}</p>
                    </div>
                    <div class="readtext1">
                      <p>SOH</p>
                    </div>
                </Col>
                <Col span="4" order="4">
                    <div class="readtext">
                        <p>{{this.Grid_Frequency}}</p>
                    </div>
                    <div class="readtext1">
                      <p>GRID FREQUENCY</p>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="readcontent">
            <div class="readcontent-name">
                <Row type="flex" style="height:100%">
                    <Col span="6" order="1" style="text-align:center">TOTAL CHARGING ENEGRY</Col>
                    <Col span="8" order="2">Battery Stack SOC</Col>
                    <Col span="5" order="3">Vol(V)</Col>
                    <Col span="5" order="4">Temp(℃)</Col>
                </Row>
            </div>
            <div class="readnext">
                <Row type="flex" style="height:100%">
                    <Col span="6" order="1" style="text-align:center;font-size:20px">{{this.Total_Charge_Energy}}</Col>
                    <Col span="8" order="2" style="position:relative">
                        <el-progress class="progress1" color = "rgba(75,196,255,0.8)" :stroke-width="30" :percentage="this.Battery_Stack_SOC_1"></el-progress>
                        <div class="progresstext">Stack1</div>
                    </Col>
                    <Col span="5" order="3" style="position:relative">
                        <p style="height:4rem">Max(ID:{{this.maxVoltage_Num}})</p>
                        <p style="border-bottom:2px dashed #E8EAED"></p>
                        <span class="bigcircle">
                            <span class="textinner">{{this.maxVoltage}}</span>
                        </span>
                    </Col>
                    <Col span="5" order="4" style="position:relative">
                        <p style="height:4rem">Max(ID:{{this.maxTemperature_Num}})</p>
                        <p style="border-bottom:2px dashed #E8EAED"></p>
                        <span class="bigcircle">
                            <span class="textinner">{{this.maxTemperature}}</span>
                        </span>
                    </Col>
                </Row>
            </div>  
            <div class="readnext">
                <Row type="flex" style="height:100%">
                    <Col span="6" order="1" style="text-align:center;color:#A8B1C0;line-height:3rem">TOTAL DISCHARGING ENEGRY</Col>
                    <Col span="8" order="2" style="position:relative">
                        <el-progress class="progress2" color = "rgba(253,148,66,0.8)"  :stroke-width="30" :percentage="this.Battery_Stack_SOC_2"></el-progress>
                        <div class="progresstext">Stack2</div>
                    </Col>
                </Row>
            </div>
            <div class="readnext">
                <Row type="flex" style="height:100%">
                    <Col span="6" order="1" style="text-align:center;font-size:20px">{{this.Total_Discharge_Energy}}</Col>
                    <Col span="8" order="2" style="position:relative">
                        <el-progress class="progress3" color = "rgba(126,177,49,0.8)" :stroke-width="30" :percentage="this.Battery_Stack_SOC_3"></el-progress>
                        <div class="progresstext">Stack3</div>
                    </Col>
                    <Col span="5" order="3" style="position:relative;padding-top:5px">
                        <p style="height:4rem">Min(ID:{{this.minVoltage_Num}})</p>
                        <p style="border-bottom:2px dashed #E8EAED"></p>
                        <span class="bigcircle suppercircle">
                            <span class="textinner">{{this.minVoltage}}</span>
                        </span>
                    </Col>
                    <Col span="5" order="4" style="position:relative">
                        <p style="height:4rem">Min(ID:{{this.minTemperature_Num}})</p>
                        <p style="border-bottom:2px dashed #E8EAED"></p>
                        <span class="bigcircle suppercircle">
                            <span class="textinner">{{this.minTemperature}}</span>
                        </span>
                    </Col>
                </Row>
            </div>
            <div class="readnext">
                <Row type="flex" style="height:100%">
                    <Col span="6" order="1" style="text-align:center;font-size:15px;color:#A8B1C0"></Col>
                    <Col span="8" order="2" style="position:relative">
                        <el-progress class="progress4" color="rgba(255,170,158,0.8)"  :stroke-width="30" :percentage="this.Battery_Stack_SOC_4"></el-progress>
                        <div class="progresstext">Stack4</div>
                    </Col>
                </Row>
            </div>
            <div class="readechart">
                <div id="readechart-left1"></div>
                <div id="readechart-left2"></div>
                <div id="readechart-left3"></div>
                <div id="readechart-left4"></div>
            </div>        
        </div>
    </div>
</template>

<script>
import SockJS from  'sockjs-client';
import  Stomp from 'stompjs';
export default {
    data(){
        return{
            count: 0,
            bgColor:'',
            stationList:[],
            stationName:'',
            stationModel:'',
            deviceList:[],
            deviceName:'',
            devModel:'',
            getDeviceId:'',
             tableData1:[],
             tableData2:[],
             stompClient:'',
              timer:'',
             //订阅的参数
             Grid_Status:'',
             Active_Power:'',
             Batter_Soc:'',
             soh:'',
             Grid_Frequency:'',
             Total_Charge_Energy:'',
             Total_Discharge_Energy:'',
             maxTemperature:'',
             minTemperature:'',
             maxTemperature_Num:'',
             minTemperature_Num:'',
             maxVoltage:'',
             minVoltage:'',
             maxVoltage_Num:'',
             minVoltage_Num:'',
             Battery_Stack_SOC_1:0,
             Battery_Stack_SOC_2:0,
             Battery_Stack_SOC_3:0,
             Battery_Stack_SOC_4:0,
             //模态框
             show: false,  
             columns1: [
                    {
                        title: 'Name',
                        key: 'name',
                        // align:'center'
                    },
                    {
                        title: 'Value',
                        key: 'value'
                    },
                    {
                        title: 'Unit',
                        key: 'unit',
                    },
                    {
                        title: 'Refresh Time',
                        key: 'refreshTs'
                    }
                ],
            
            columns2: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Status',
                        key: 'status',
                        align:'center',
                        render: (h,params)=>{
                            if(params.row.status == 1){
                                return h('div',[
                                h('Icon',{
                                    props:{
                                        type:'ios-information-circle',
                                        size:20,
                                        color:'red',  
                                    },
                                    on: {
                                        click: (data,index,event) => {
                                        }
                                    }
                                })
                            ])
                            }else{
                               return h('div',[
                                h('Icon',{
                                    props:{
                                        type:'ios-information-circle',
                                        size:20,
                                        color:'green',  
                                    },
                                    on: {
                                        click: (data,index,event) => {
                                        }
                                    }
                                })
                            ]) 
                            }
                            
                        }
                    },
                    {
                        title: 'Refresh Time',
                        key: 'refreshTime',
                        align:'center'
                    }
                ],
        }
    },
    props: ['contentHeight','contentWidth'],
     mounted(){
        //获取站点
        this.getStation();
        this.getDevice();
        this.date.initFormatter();
        
    },
    methods:{
        //判断设备的连接状态
        deviceSatus(){
            let entityId = this.getDeviceId
            let that = this
            if(that.$store.state.readSystemStatus){
                    that.$store.state.readSystemStatus.close();
                }
            that.$store.state.readSystemStatus = new WebSocket("ws://" + '58.246.246.102:8082' + "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
            that.$store.state.readSystemStatus.onopen = function () {
            var object = {
                tsSubCmds: [{
                // entityType: "DEVICE",
                // // entityId: this.getDeviceId,
                // entityId: entityId,
                // keys: "PCS_Total_Charge_Energy,PCS_Total_Discharge_Energy,Grid_Status,PCS_Active_Power,System_SOC,System_SOH,PCS_Grid_Frequency,PCS_Work_Status,Max_Cell_Temperature,Max_Cell_Temperature_Num,Min_Cell_Temperature,Min_Cell_Temperature_Num,Max_Cell_Voltage,Max_Cell_Voltage_Num,Min_Cell_Voltage,Min_Cell_Voltage_Num,Battery_Stack_SOC_1,Battery_Stack_SOC_2,Battery_Stack_SOC_3,Battery_Stack_SOC_4",
                // scope: "LATEST_TELEMETRY",
                // cmdId: 25
                }],
                attrSubCmds: [
                    {
						cmdId: 1,
						entityId: 'd5e24600-17e0-11e9-8b81-4fe3ea54c32b',
						entityType: "DEVICE",
						scope: "SERVER_SCOPE",
						keys: "lastConnectTime,lastDisconnectTime"
                      }
                ]
            };
            let dataSend = JSON.stringify(object);
            that.$store.state.readSystemStatus.send(dataSend);
            };

            that.$store.state.readSystemStatus.onmessage = (event) => {
            var data = JSON.parse(event.data).latestValues;
            let lastConnectTime = data.lastConnectTime
            let lastDisconnectTime = data.lastDisconnectTime
                if(lastConnectTime > lastDisconnectTime){
                    this.bgColor = 'green'
                }else{
                    this.bgColor = 'red'
                }
            }

            
        },
        closeShow(){
            this.show = false
        },
        tableLeft(){
            let that = this
            let bb = this.getDeviceId
            function timestampToTime(timestamp, flag,flagTwo,flagThree) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear();
                var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
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
            //axios请求历史数据
            this.$axios.get(this.$store.state.api + '/om/data/readOnlyTelemeter/'+bb)
            .then((response) => {
                var data = response.data;
                //参数名
                var dataParam = '';
                //定义单位
                var objUnit = {};
                var paramUnit;
                for (var i = 0;i < data.length; i++){
                    dataParam = dataParam + data[i].name + ',';
                        
                        if(data[i].unit){
                            paramUnit = data[i].unit;
                        }else{
                            paramUnit = '/'
                        }
                        objUnit[data[i].name] = paramUnit;
                    
                }
                //去掉逗号
                dataParam = dataParam.substr(0, dataParam.length - 1);
                if(that.$store.state.readLeftTable){
                    that.$store.state.readLeftTable.close();
                }
                that.$store.state.readLeftTable = new WebSocket("ws://" + '58.246.246.102:8082' + 
                "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
                that.$store.state.readLeftTable.onopen = function () {
                var object = {
                    tsSubCmds: [{
                    entityType: "DEVICE",
                    entityId: bb,
                    keys: dataParam,
                    scope: "LATEST_TELEMETRY",
                    cmdId: 25
                    }],
                    attrSubCmds: []
                };
                let dataSend = JSON.stringify(object);
                that.$store.state.readLeftTable.send(dataSend);
                };
                this.tableData1=[]
                that.$store.state.readLeftTable.onmessage = (event) => {
                let data1 = JSON.parse(event.data).data;
                if (this.tableData1.length !== data.length) {
                    for (var k in data1) {
                    this.tableData1.push({
                        name: k,
                        value: data1[k][0][1],
                        unit: objUnit[k],
                        refreshTs:timestampToTime(data1[k][0][0],true)
                        })  
                    }
                } else {
                       for( var i = 0; i < this.tableData1.length; i++){
                              for (var k in data1) {
                                  if (k === this.tableData1[i].name) {
                                    this.tableData1[i].value = data1[k][0][1];
                                    this.tableData1[i].refreshTs = timestampToTime(data1[k][0][0],true);
                                  }
                              }  
                        }
                }
              
                }

            })
            
        },
        tableRight(){
            let entityId = this.getDeviceId
            function timestampToTime(timestamp, flag,flagTwo,flagThree) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear();
                var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
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
            this.count = 0;
            this.$axios.get(this.$store.state.api + '/om/data/telesignal/'+entityId)
            .then((response) => {
                var data = response.data
                this.tableData2 = [];
                for( var i = 0; i < data.length;i++){
                    
                    if(data[i].refreshTime){
                        this.tableData2.push({
                            name: data[i].name,
                            status: data[i].status,
                            refreshTime: timestampToTime(data[i].refreshTime, true),
                        })
                    }else{
                        this.tableData2.push({
                            name: data[i].name,
                            status: data[i].status,
                            refreshTime: '-/-',
                        })
                    }
                    
                }
            let  that = this;
            });
           
           
        },
        getInfo(){
            let that = this
            var websocketFMiddleTwo;
            let entityId = this.getDeviceId
            // 将数据以三位分节法展示
            function thousands(num) {
                var str = num.toString();
                var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
                return str.replace(reg, "$1,");
            }
            if(that.$store.state.readInfo){
                    that.$store.state.readInfo.close();
                }
            that.$store.state.readInfo = new WebSocket("ws://" + '58.246.246.102:8082' + "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
            that.$store.state.readInfo.onopen = function () {
            var object = {
                tsSubCmds: [{
                entityType: "DEVICE",
                // entityId: this.getDeviceId,
                entityId: entityId,
                keys: "PCS_Total_Charge_Energy,PCS_Total_Discharge_Energy,Grid_Status,PCS_Active_Power,System_SOC,System_SOH,PCS_Grid_Frequency,PCS_Work_Status,Max_Cell_Temperature,Max_Cell_Temperature_Num,Min_Cell_Temperature,Min_Cell_Temperature_Num,Max_Cell_Voltage,Max_Cell_Voltage_Num,Min_Cell_Voltage,Min_Cell_Voltage_Num,Battery_Stack_SOC_1,Battery_Stack_SOC_2,Battery_Stack_SOC_3,Battery_Stack_SOC_4",
                scope: "LATEST_TELEMETRY",
                cmdId: 25
                }],
                attrSubCmds: []
            };
            let dataSend = JSON.stringify(object);
            that.$store.state.readInfo.send(dataSend);
            };

            that.$store.state.readInfo.onmessage = (event) => {
            var data = JSON.parse(event.data).data;
            // fTop
            if (data) {
                if (data.Grid_Status) {
                if (data.Grid_Status[0][1] == '1.0') {
                    this.Grid_Status = 'OK'
                    
                } else {
                    this.Grid_Status = 'Fault'
                    // this.bgColor = 'red'
                }
                }
                if (data.PCS_Active_Power) {
                    if(this.Active_Power = data.PCS_Active_Power[0][1]){
                        this.Active_Power = Number(data.PCS_Active_Power[0][1])+ 'KW'
                    }else{
                         this.Active_Power = 'Null'
                    }
                }
                if (data.System_SOC) {
                    if(this.Batter_Soc = data.System_SOC[0][1]){
                        this.Batter_Soc = Number(data.System_SOC[0][1]).toFixed(3) * 100 + '%'
                    }else{
                        this.Batter_Soc = 'Null'
                    }
                }
                if (data.System_SOH) {
                this.soh = Number(data.System_SOH[0][1]) ?  Number(data.System_SOH[0][1]).toFixed(3) * 100 + '%' : 'Null';
                }
                if (data.PCS_Grid_Frequency) {
                this.Grid_Frequency = Number(data.PCS_Grid_Frequency[0][1]) ? Number(data.PCS_Grid_Frequency[0][1]).toFixed(3) + 'Hz' : 'Null';
                }
                // if (data.PCS_Work_Status) {
                // spans.eq(5).text(data.PCS_Work_Status[0][1] ? data.PCS_Work_Status[0][1] : 'Null');
                // }
                if (data.PCS_Total_Charge_Energy) {
                this.Total_Charge_Energy = thousands(+data.PCS_Total_Charge_Energy[0][1]) + ' kWh';
                }
                if (data.PCS_Total_Discharge_Energy) {
                this.Total_Discharge_Energy = thousands(+data.PCS_Total_Discharge_Energy[0][1]) + ' kWh';
                }
                if (data.Battery_Stack_SOC_1) {
                this.Battery_Stack_SOC_1 = Number(data.Battery_Stack_SOC_1[0][1]*100).toFixed(3);
                this.Battery_Stack_SOC_1  = Number(this.Battery_Stack_SOC_1 )
                // this.Battery_Stack_SOC_1 = data.Battery_Stack_SOC_1[0][1].substring(0,data.Battery_Stack_SOC_1[0][1].indexOf("."));
                }
                if (data.Battery_Stack_SOC_2) {
                // this.Battery_Stack_SOC_2.animate({
                //     width: data.Battery_Stack_SOC_2[0][1] + '%'
                // }, 1000);
                this.Battery_Stack_SOC_2 = Number(data.Battery_Stack_SOC_2[0][1]*100).toFixed(3);
                this.Battery_Stack_SOC_2  = Number(this.Battery_Stack_SOC_2 )
                // this.Battery_Stack_SOC_2 = data.Battery_Stack_SOC_2[0][1].substring(0,data.Battery_Stack_SOC_2[0][1].indexOf("."));
                }
                if (data.Battery_Stack_SOC_3) {
                // this.Battery_Stack_SOC_3.animate({
                //     width: data.Battery_Stack_SOC_3[0][1] + '%'
                // }, 1000);
                this.Battery_Stack_SOC_3 = Number(data.Battery_Stack_SOC_3[0][1]*100).toFixed(3);
                this.Battery_Stack_SOC_3  = Number(this.Battery_Stack_SOC_3 )
                // this.Battery_Stack_SOC_3 = data.Battery_Stack_SOC_3[0][1].substring(0,data.Battery_Stack_SOC_3[0][1].indexOf("."));
                }
                if (data.Battery_Stack_SOC_4) {
                // this.Battery_Stack_SOC_4.animate({
                //     width: data.Battery_Stack_SOC_4[0][1] + '%'
                // }, 1000);
                this.Battery_Stack_SOC_4 = Number(data.Battery_Stack_SOC_4[0][1]*100).toFixed(3);
                this.Battery_Stack_SOC_4  = Number(this.Battery_Stack_SOC_4 )
                // this.Battery_Stack_SOC_4 = data.Battery_Stack_SOC_4[0][1].substring(0,data.Battery_Stack_SOC_4[0][1].indexOf("."));
                }
                
                if (data.Max_Cell_Temperature) {
                this.maxTemperature = data.Max_Cell_Temperature[0][1] ? Number(data.Max_Cell_Temperature[0][1]).toFixed(2) + '℃' : 'Null';
                }
                if (data.Min_Cell_Temperature) {
                this.minTemperature = data.Min_Cell_Temperature[0][1] ? Number(data.Min_Cell_Temperature[0][1]).toFixed(2) + '℃' : 'Null';
                }
                if (data.Max_Cell_Voltage) {
                this.maxVoltage = data.Max_Cell_Voltage[0][1] ? Number(data.Max_Cell_Voltage[0][1]).toFixed(3) + 'V' : 'Null';
                }
                if (data.Min_Cell_Voltage) {
                this.minVoltage = data.Min_Cell_Voltage[0][1] ? Number(data.Min_Cell_Voltage[0][1]).toFixed(3) + 'V' : 'Null';
                }
                if (data.Max_Cell_Temperature_Num) {
                this.maxTemperature_Num = data.Max_Cell_Temperature_Num[0][1] ? parseInt(data.Max_Cell_Temperature_Num[0][1]) : 'Null';
                }
                if (data.Min_Cell_Temperature_Num) {
                this.minTemperature_Num = data.Min_Cell_Temperature_Num[0][1] ? parseInt(data.Min_Cell_Temperature_Num[0][1]) : 'Null';
                }
                if (data.Max_Cell_Voltage_Num) {
                this.maxVoltage_Num = data.Max_Cell_Voltage_Num[0][1] ?parseInt(data.Max_Cell_Voltage_Num[0][1]) : 'Null';
                }
                if (data.Min_Cell_Voltage_Num) {
                this.minVoltage_Num = data.Min_Cell_Voltage_Num[0][1] ? parseInt(data.Min_Cell_Voltage_Num[0][1]) : 'Null';
                }
                
            }


            };
        },
        getStation(){
            this.$axios.get(this.$store.state.api + '/om/data/stationInfo')
            .then((response) => {
                this.stationList = response.data;
                for( var i =0;i<response.data.length;i++){
                    this.stationName = response.data[i].stationId;
                }
                this.stationModel =  this.stationList[0]['stationId'];
                
            })
        },
        getDevice(){
            this.$axios.get(this.$store.state.api + '/om/data/deviceList')
            .then((response) => {
                // console.log(response.data)
                for( var i =0;i<response.data.length;i++){
                    this.deviceName = response.data[0].stationId
                    this.stationName = response.data[0].stationId
                    if(this.deviceName == this.stationName){
                        this.deviceList = response.data[0].deviceList;
                        this.devModel = this.deviceList[0]['deviceId'];
                        this.getDeviceId = this.deviceList[0]['deviceId'];
                        
                        
                    }
                    
                } 
                
                this.$nextTick(function () {  
                          setTimeout(() => {
                              this.drawlineone();
                              this.drawlinethree();
                              this.drawlinefour();
                              this.getInfo();
                              this.tableLeft();
                              this.tableRight()
                              this.deviceSatus()
                            
                          }, 0);
                       
                        })
                  
                
            })
        },
        selectStation(value) {
            this.stationName = value;
            this.$axios.get(this.$store.state.api + '/om/data/deviceList')
            .then((response) => {
                for( var i =0;i<response.data.length;i++){
                    this.deviceName = response.data[i].stationId
                    if(this.stationName == this.deviceName){
                            this.deviceList = response.data[i].deviceList;
                            if(this.deviceList.length == 0){
                                this.devModel = ''
                            }else{
                                this.devModel = this.deviceList[0]['deviceId'];
                                this.getDeviceId = this.deviceList[0]['deviceId'];
                            }
                                               
                        } 
                    
                } 
                this.$nextTick(function () {  
                        this.drawlineone();
                        this.drawlinethree();
                        this.drawlinefour();
                        this.getInfo();
                        this.tableLeft();
                        this.tableRight()
                        this.deviceSatus()
                        })
                
            })

        },
        selectDevice(value){        
            this.getDeviceId = value
            this.$nextTick(function () {  
                        this.drawlineone();
                        this.drawlinethree();
                        this.drawlinefour();
                        this.getInfo();
                        this.tableLeft();
                        this.tableRight()
                        this.deviceSatus()
                        })
                        
        },
        drawlineone (){
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
            let that = this
            let a;
            if(this.getDeviceId){
                a = this.getDeviceId;
                
            }else{
                a = ''
            }
            // var myChart1 =  this.$echarts.init(document.getElementById('clilefttop-left'));
            // var myChart2 =  this.$echarts.init(document.getElementById('clilefttop-right'));
            var Chart = document.getElementById('readechart-left1');
            var Chart1 = document.getElementById('readechart-left2');
            Chart.removeAttribute("_echarts_instance_");//清除之前的echarts
            Chart1.removeAttribute("_echarts_instance_");//清除之前的echarts
            var myChart1 =  this.$echarts.init(Chart);
            var myChart2 =  this.$echarts.init(Chart1);
            var dataAP = [];
            var dataSOC = [];
            var maxAP = '';
            var maxSOC = '';
            var minAP = '';
            var minSOC = '';
            var dataIa = [];
            var dataIb = [];
            var dataIc = [];
            var allData = [];
            var maxData = '';
            var minData = '';
            var currentTime = (new Date()).getTime();;
            var beforeTime = currentTime - 1000 * 60 * 10;
            var flag = false;
            if(that.$store.state.echartsOne){
                    that.$store.state.echartsOne.close();
                }
            that.$store.state.echartsOne  = new WebSocket("ws://" + '58.246.246.102:8082' + "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
            that.$store.state.echartsOne .onopen = function () {
            var object = {
                tsSubCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_Active_Power,System_SOC,PCS_Ia,PCS_Ib,PCS_Ic",
                scope: "LATEST_TELEMETRY",
                cmdId: 25
                }],
                historyCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_Active_Power,System_SOC,PCS_Ia,PCS_Ib,PCS_Ic",
                startTs: beforeTime,
                endTs: currentTime,
                interval: 2000,
                limit: 100000
                }],
                attrSubCmds: []
            };
            let dataSend = JSON.stringify(object);
            if (that.$store.state.echartsOne.readyState === 1) {
                that.$store.state.echartsOne.send(dataSend);
            }
            };
            that.$store.state.echartsOne.onmessage = evt => {
            var data = JSON.parse(evt.data).data;

            if(data){
                if (Object.keys(data).length) {
                // 长度大于一，为历史数据
                if (data.PCS_Active_Power.length > 1) {
                // 每个参数的数组长度大于1,表示为历史数据
                            if (data.PCS_Active_Power) {
                            data.PCS_Active_Power.forEach(function (item, index) {
                                // dataAP.push([item[0], item[1]]);
                                 dataAP.push({
                                    name: item[0],
                                    value: [item[0],item[1]]
                                });
                                // console.log(dataAP)
                            });
                            }
                            if (data.PCS_Ia) {
                            data.PCS_Ia.forEach(function (item, index) {
                                // dataIa.push([item[0], item[1]]);
                                dataIa.push({
                                    name: item[0],
                                    value: [item[0],item[1]]
                                });
                            });
                            }
                            if (data.PCS_Ib) {
                            data.PCS_Ib.forEach(function (item, index) {
                                // dataIb.push([item[0], item[1]]);
                                dataIb.push({
                                    name: item[0],
                                    value: [item[0],item[1]]
                                });
                                
                            });
                            }
                            if (data.PCS_Ic) {
                            data.PCS_Ic.forEach(function (item, index) {
                                // dataIc.push([item[0], item[1]]);
                                dataIc.push({
                                    name: item[0],
                                    value: [item[0],item[1]]
                                });
                            });
                            }
                            data.System_SOC.forEach(function (item, index) {
                            // dataSOC.push([item[0], item[1]]);
                            dataSOC.push({
                                    name: item[0],
                                    value: [item[0],item[1]]
                                });
                            });
                            maxSOC = that.$store.state.getMax(dataSOC);
                            minSOC = that.$store.state.getMin(dataSOC);
                            maxSOC = Number(maxSOC*100).toFixed(1)
                            minSOC = Number(minSOC*100).toFixed(1)
                            maxAP = that.$store.state.getMax(dataAP);
                            minAP = that.$store.state.getMin(dataAP);
                            allData = [];
                            allData.push.apply(allData, dataIa);
                            allData.push.apply(allData, dataIb);
                            allData.push.apply(allData, dataIc);
                            maxData = that.$store.state.getMax(allData);
                            minData = that.$store.state.getMin(allData);
                            dataAP = dataAP.reverse();
                            dataSOC = dataSOC.reverse();
                            for(var i = 0;i<dataSOC.length;i++){
                                dataSOC[i].value[1]*=100
                            }
                            dataIa = dataIa.reverse();
                            dataIb = dataIb.reverse();
                            dataIc = dataIc.reverse();
                            getData(dataAP, dataSOC, maxAP, maxSOC, minAP, minSOC, currentTime, beforeTime);
                            getDataTwo(dataIa, dataIb, dataIc, maxData, minData, currentTime, beforeTime);
                } else {
                if(flag){
                    // 长度为一，表示为新数据
                        if (data.System_SOC) {
                            currentTime = data.System_SOC[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if(beforeTime > dataSOC[0][0]){
                            dataSOC.shift();
                            }
                            dataSOC.push({
                                name: data.System_SOC[0][0],
                                value: [data.System_SOC[0][0], data.System_SOC[0][1]*100]
                            });
                            // dataSOC.push([data.System_SOC[0][0], data.System_SOC[0][1]]);
                        }
                        if (data.PCS_Active_Power) {
                            currentTime = data.PCS_Active_Power[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if(beforeTime > dataAP[0][0]){
                            dataAP.shift();
                            }
                            dataAP.push({
                                name: data.PCS_Active_Power[0][0],
                                value: [data.PCS_Active_Power[0][0], data.PCS_Active_Power[0][1]]
                            });
                            // dataAP.push([data.PCS_Active_Power[0][0], data.PCS_Active_Power[0][1]]);
                        }
                        if (data.PCS_Ia) {
                            currentTime = data.PCS_Ia[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if(beforeTime > dataIa[0][0]){
                            dataIa.shift();
                            }
                            dataIa.push({
                                name: data.PCS_Ia[0][0],
                                value: [data.PCS_Ia[0][0], data.PCS_Ia[0][1]]
                            });
                            // dataIa.push([data.PCS_Ia[0][0], data.PCS_Ia[0][1]]);
                        }
                        if (data.PCS_Ib) {
                            currentTime = data.PCS_Ib[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if(beforeTime > dataIb[0][0]){
                            dataIb.shift();
                            }
                            dataIb.push({
                                name: data.PCS_Ib[0][0],
                                value: [data.PCS_Ib[0][0], data.PCS_Ib[0][1]]
                            });
                            // dataIb.push([data.PCS_Ib[0][0], data.PCS_Ib[0][1]]);
                        }
                        if (data.PCS_Ic) {
                            currentTime = data.PCS_Ic[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if(beforeTime > dataIc[0][0]){
                            dataIc.shift();
                            }
                            dataIc.push({
                                name: data.PCS_Ic[0][0],
                                value: [data.PCS_Ic[0][0], data.PCS_Ic[0][1]]
                            });
                            // dataIc.push([data.PCS_Ic[0][0], data.PCS_Ic[0][1]]);
                        }
                        maxAP = that.$store.state.getMax(dataAP);
                        // console.log(maxAP)
                        minAP = that.$store.state.getMin(dataAP);
                        maxSOC = that.$store.state.getMax(dataSOC);
                        minSOC = that.$store.state.getMin(dataSOC);
                        maxSOC = Number(maxSOC).toFixed(1)
                        minSOC = Number(minSOC).toFixed(1)
                        allData = [];
                        allData.push.apply(allData, dataIa);
                        allData.push.apply(allData, dataIb);
                        allData.push.apply(allData, dataIc);
                        maxData = that.$store.state.getMax(allData);
                        minData = that.$store.state.getMin(allData);
                        getData(dataAP, dataSOC, maxAP, maxSOC, minAP, minSOC, currentTime, beforeTime);
                        getDataTwo(dataIa, dataIb, dataIc, maxData, minData, currentTime, beforeTime);
                }
                flag = true;
                }
                } else {
                    if(dataAP.length == 0){
                        console.log(111111)
                    dataAP = judgeLength(dataAP,80);
                    }
                    if(dataSOC.length == 0){
                    dataSOC = judgeLength(dataSOC,80);
                    }
                    if(dataIa.length == 0){
                    dataIa = judgeLength(dataIa,80);
                    }
                    if(dataIb.length == 0){
                    dataIb = judgeLength(dataIb,80);
                    }
                    if(dataIc.length == 0){
                    dataIc = judgeLength(dataIc,80);
                    }
                    getData(dataAP, dataSOC, maxAP, maxSOC, minAP, minSOC, currentTime, beforeTime);
                    getDataTwo(dataIa, dataIb, dataIc, maxData, minData, currentTime, beforeTime);
                }
            };

            // 指定图表的配置项和数据
                function getData(dataOne, dataTwo, maxOne, maxTwo, minOne, minTwo, maxX, minX) {
                    var option = {
                        color: ['#4bc4ff', '#fd944a'],
                        tooltip: {
                            trigger: 'axis'
                        },
                            legend: {
                            show: true,
                            data: ['ACTIVE POWER', 'SOC'],
                            icon: 'line',
                            itemWidth: 14,
                            itemHeight: 2,
                            itemGap: 13,
                            right: '0%',
                            top: '5%',
                            textStyle: {
                                fontSize: 10,
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'time',
                            boundaryGap: false,
                            axisLine: {show: false},
                            axisTick: {show: false},
                            axisLabel: {
                                color: '#B3B5B7'
                            },
                            splitLine:{
                                show:false
                            },
                            max: maxX,
                            min: minX
                        },
                        yAxis: [{
                            type: 'value',
                            //去掉y轴
                            axisLine: {show: false},
                            //去掉y轴分割线
                            axisTick: {show: false},
                            name: '(kW)',
                            nameTextStyle: {
                                fontSize: 12,
                                fontFamily: 'exoDemiBold'
                            },
                            axisLabel: {
                                color: '#B3B5B7'
                            },
                            max: maxOne,
                            min: minOne,
                            splitLine: {
                                lineStyle: {
                                type: 'solid',
                                }
                            }
                        },
                        {
                            type: 'value',
                            axisLine: {show: false},
                            axisTick: {show: false},
                            position: 'right',
                            axisLabel: {
                                color: '#B3B5B7',
                                formatter: '{value} %'
                            },
                            max: maxTwo,
                            min: minTwo,
                            splitLine: {
                                show: false
                            }
                        }
                        ],
                        series: [{
                            name: 'ACTIVE POWER',
                            data: dataOne,
                            type: 'line',
                            showSymbol: false,
                            smooth: true,
                            itemStyle: {
                                normal: {
                                shadowColor: 'rgba(255,255,255,.6)',
                                shadowBlur: 20
                                }
                            }
                        },
                        {
                            name: 'SOC',
                            data: dataTwo,
                            type: 'line',
                            yAxisIndex: 1,
                            showSymbol: false,
                            smooth: true,
                            itemStyle: {
                                normal: {
                                shadowColor: 'rgba(255,255,255,.6)',
                                shadowBlur: 20
                                }
                            }
                        }
                        ]
                    };
                    myChart1.setOption(option,true);
                    // window.onresize=function(){
                    // myChart1.resize();
                    // }
                }

                function getDataTwo(dataOne, dataTwo, dataThree, maxOne, minOne, maxX, minX) {
                    var option = {
                        tooltip: {
                        trigger: 'axis'
                        },
                        color: ['#f7d52c', '#50e3c2', '#fa5f7d'],
                        legend: {
                        show: true,
                        data: ['PCS_Ia', 'PCS_Ib', 'PCS_Ic'],
                        icon: 'rect',
                        itemWidth: 14,
                        itemHeight: 2,
                        itemGap: 13,
                        right: '0%',
                        top: '5%',
                        textStyle: {
                            fontSize: 10,
                            fontFamily: 'exoDemiBold'
                        }
                        },
                        grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                        },
                        xAxis: {
                        type: 'time',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        boundaryGap: false,
                        axisLabel: {
                            color: '#B3B5B7',
                        },
                        splitLine:{
                            show:false
                        },
                        max: maxX,
                        min: minX
                        },
                        yAxis: [{
                        type: 'value',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        name: '(A)',
                        nameTextStyle: {
                            fontSize: 12,
                            fontFamily: 'exoDemiBold'
                        },
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        max: maxOne,
                        min: minOne,
                        splitLine: {
                            lineStyle: {
                            type: 'solid',
                            
                            }
                        }
                        }],
                        series: [{
                        name: 'PCS_Ia',
                        data: dataOne,
                        type: 'line',
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                            shadowColor: 'rgba(255,255,255,.6)',
                            shadowBlur: 20
                            }
                        }
                        },
                        {
                        name: 'PCS_Ib',
                        data: dataTwo,
                        type: 'line',
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                            shadowColor: 'rgba(255,255,255,.6)',
                            shadowBlur: 20
                            }
                        }
                        },
                        {
                        name: 'PCS_Ic',
                        data: dataThree,
                        type: 'line',
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                            shadowColor: 'rgba(255,255,255,.6)',
                            shadowBlur: 20
                            }
                        }
                        }
                        ]
                    };
                    myChart2.setOption(option,true);
                    // window.onresize=function(){
                    // myChart2.resize();
                    // }
                }
            }
            

        },
        drawlinethree(){
            let that = this
            var a = this.getDeviceId;
            // var myChart3 =  this.$echarts.init(document.getElementById('clileftbottom-left'));
            var Chart2 = document.getElementById('readechart-left3');
            Chart2.removeAttribute("_echarts_instance_");//清除之前的echarts
            var myChart3 =  this.$echarts.init(Chart2);
            var dataPGF = [];
            var maxPGF = '';
            var minPGF = '';
            var currentTime = (new Date()).getTime();;
            var beforeTime = currentTime - 1000 * 60 * 10;
            var flag = false;
            if(that.$store.state.echartsTwo){
                    that.$store.state.echartsTwo.close();
                }
            that.$store.state.echartsTwo = new WebSocket("ws://" + '58.246.246.102:8082' + "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
            that.$store.state.echartsTwo.onopen = function () {
            var object = {
                tsSubCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_Grid_Frequency",
                scope: "LATEST_TELEMETRY",
                cmdId: 25
                }],
                historyCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_Grid_Frequency",
                startTs: beforeTime,
                endTs: currentTime,
                interval: 2000,
                limit: 100000
                }],
                attrSubCmds: []
            };
            let dataSend = JSON.stringify(object);
            if (that.$store.state.echartsTwo.readyState === 1) {
                that.$store.state.echartsTwo.send(dataSend);
            }
            };
            that.$store.state.echartsTwo.onmessage = evt => {
            var data = JSON.parse(evt.data).data;
            if(data){
                if (Object.keys(data).length) {
                    // 长度大于一，为历史数据
                    if (data.PCS_Grid_Frequency.length > 1) {
                        data.PCS_Grid_Frequency.forEach(function (item, index) {
                            // dataPGF.push([item[0],item[1]]);
                            dataPGF.push({
                                name: item[0],
                                value: [item[0],item[1]]
                            });
                        })
                        maxPGF = that.$store.state.getMax(dataPGF);
                        minPGF = that.$store.state.getMin(dataPGF);
                        dataPGF = dataPGF.reverse();
                        render(dataPGF, maxPGF, minPGF, currentTime,beforeTime);
                    } else {
                    if(flag){
                        if (data.PCS_Grid_Frequency) {
                            currentTime = data.PCS_Grid_Frequency[0][0];
                            beforeTime = currentTime - 1000 * 60 * 10;
                            if (beforeTime > dataPGF[0][0]) {
                                dataPGF.shift();
                            }
                            dataPGF.push({
                                name: data.PCS_Grid_Frequency[0][0],
                                value: [data.PCS_Grid_Frequency[0][0], data.PCS_Grid_Frequency[0][1]]
                            });
                
                            // dataPGF.push([data.PCS_Grid_Frequency[0][0], data.PCS_Grid_Frequency[0][1]]);
                            maxPGF = that.$store.state.getMax(dataPGF);
                            minPGF = that.$store.state.getMin(dataPGF);
                            render(dataPGF, maxPGF, minPGF, currentTime, beforeTime);
                        }
                    }
                    flag = true;
                    }
                } else {
                    if(dataPGF == 0){
                    dataPGF = this.common.judgeLength(dataPGF,80);
                    }
                    render(dataPGF, maxPGF, minPGF, currentTime,beforeTime);
                }
                };

                function render(data, maxData, minData,maxX,minX) {
                // 指定图表的配置项和数据
                var option = {
                        color: ['#4bc4ff'],
                        tooltip: {
                        trigger: 'axis'
                        },
                        legend: {
                        show: true,
                        data: ['SYSTEM FREQUENCY'],
                        icon: 'rect',
                        itemWidth: 14,
                        itemHeight: 2,
                        itemGap: 13,
                        right: '0%',
                        top: '5%',
                        textStyle: {
                            fontSize: 10,
                            fontFamily: 'exoDemiBold'
                        }
                        },
                        grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                        },
                        xAxis: {
                        type: 'time',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        boundaryGap: false,
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        splitLine:{
                            show:false
                        },
                        max: maxX,
                        min: minX
                        },
                        yAxis: [
                        {
                        type: 'value',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        name: '(Hz)',
                        nameTextStyle: {
                            fontSize: 12,
                            fontFamily: 'exoDemiBold'
                        },
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        max: maxData,
                        min: minData,
                        splitLine: {
                            lineStyle: {
                            type: 'solid',
                            }
                        }
                        }],
                        series: [{
                        name: 'SYSTEM FREQUENCY',
                        data: data,
                        type: 'line',
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                            shadowColor: 'rgba(255,255,255,.6)',
                            shadowBlur: 20
                            }
                        }
                        }]
                    };
                // 使用刚指定的配置项和数据显示图表。
                myChart3.setOption(option,true);
                // window.onresize=function(){
                // myChart3.resize();
                // }
                }
            }

        },
        drawlinefour(){
            let that = this
            var a = this.getDeviceId;
            var Chart3 = document.getElementById('readechart-left4');
            Chart3.removeAttribute("_echarts_instance_");//清除之前的echarts
            var myChart4 =  this.$echarts.init(Chart3);
            var dataDCV = [];
            var dataACV = [];
            var maxDCV = '';
            var maxACV = '';
            var minDCV = '';
            var minACV = '';
            var currentTime = (new Date()).getTime();;
            var beforeTime = currentTime - 1000 * 60 * 10;
            var flag = false;
            if(that.$store.state.echartsThree){
                    that.$store.state.echartsThree.close();
                }
            that.$store.state.echartsThree = new WebSocket("ws://" + '58.246.246.102:8082' + "/api/ws/plugins/telemetry?token=" + 
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdW53b2RhQHBvd2VyeC5pbyIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiOGYzMGE4ZjAtMTdhZS0xMWU5LWIxNTktYzlkY2EwNTAxYTIxIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjcxOTI5MTUwLTE3YWUtMTFlOS1iMTU5LWM5ZGNhMDUwMWEyMSIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTU0NzgwMjIyOCwiZXhwIjoxNjM3ODAyMjI4fQ.PyJMAdnHceoCGP35zssrghIHw_A2EyynthLmld2JBQkDE3KrTfxg-xoZeYWJEofNqg-qzpWfoXmMH1xAs-3VwA');
            that.$store.state.echartsThree.onopen = function () {
            var object = {
                tsSubCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_DC_Voltage,PCS_Vab",
                scope: "LATEST_TELEMETRY",
                cmdId: 25
                }],
                historyCmds: [{
                entityType: "DEVICE",
                entityId: a,
                keys: "PCS_DC_Voltage,PCS_Vab",
                startTs: beforeTime,
                endTs: currentTime,
                interval: 2000,
                limit: 100000
                }],
                attrSubCmds: []
            };
            let dataSend = JSON.stringify(object);
            if (that.$store.state.echartsThree.readyState === 1) {
                that.$store.state.echartsThree.send(dataSend);
            }
            };
            that.$store.state.echartsThree.onmessage = evt => {
            var data = JSON.parse(evt.data).data;
            if(data){
                if (Object.keys(data).length) {
                    // 长度大于一，为历史数据
                    if (data.PCS_DC_Voltage.length != 1) {
                        data.PCS_DC_Voltage.forEach(function (item, index) {
                            dataDCV.push({
                                name: item[0],
                                value: [item[0],item[1]]
                            });
                        // dataDCV.push([item[0],item[1]]);
                        })
                        data.PCS_Vab.forEach(function (item, index) {
                            dataACV.push({
                                name: item[0],
                                value: [item[0],item[1]]
                            });
                        // dataACV.push([item[0],item[1]]);
                        })
                        maxDCV = that.$store.state.getMax(dataDCV);
                        minDCV = that.$store.state.getMin(dataDCV);
                        maxACV = that.$store.state.getMax(dataACV);
                        minACV = that.$store.state.getMin(dataACV);
                        dataDCV = dataDCV.reverse();
                        dataACV = dataACV.reverse();
                        render( dataDCV, dataACV, maxDCV, minDCV, maxACV, minACV,currentTime,beforeTime);
                    }  else {
                    if(flag){
                        if (data.PCS_DC_Voltage) {
                        if (data.PCS_DC_Voltage[0][1]) {
                        currentTime = data.PCS_DC_Voltage[0][0];
                        beforeTime = currentTime - 1000 * 60 * 10;
                        if(beforeTime > dataDCV[0][0]){
                            dataDCV.shift();
                        }
                        dataDCV.push({
                                name: data.PCS_DC_Voltage[0][0],
                                value: [data.PCS_DC_Voltage[0][0], data.PCS_DC_Voltage[0][1]]
                            });
                        // dataDCV.push([data.PCS_DC_Voltage[0][0],data.PCS_DC_Voltage[0][1]]);
                        maxDCV = that.$store.state.getMax(dataDCV);
                        minDCV = that.$store.state.getMin(dataDCV);
                        render( dataDCV, dataACV, maxDCV, minDCV, maxACV, minACV,currentTime,beforeTime);
                        }
                    }
                    if (data.PCS_Vab) {
                        if (data.PCS_Vab[0][1]) {
                        currentTime = data.PCS_Vab[0][0];
                        beforeTime = currentTime - 1000 * 60 * 10;
                        if(beforeTime > dataACV[0][0]){
                            dataACV.shift();
                        }
                        dataACV.push({
                                name: data.PCS_Vab[0][0],
                                value: [data.PCS_Vab[0][0], data.PCS_Vab[0][1]]
                            });
                        // dataACV.push([data.PCS_Vab[0][0],data.PCS_Vab[0][1]]);
                        maxACV = that.$store.state.getMax(dataACV);
                        minACV = that.$store.state.getMin(dataACV);
                        render( dataDCV, dataACV, maxDCV, minDCV, maxACV, minACV,currentTime,beforeTime);
                        }
                    }
                    }
                    flag = true;
                    }
                } else {
                    if(dataDCV.length == 0){
                    dataDCV = this.common.judgeLength(dataDCV,80);
                    }
                    if(dataACV.length == 0){
                    dataACV = this.common.judgeLength(dataACV,80);
                    }
                    render( dataDCV, dataACV, maxDCV, minDCV, maxACV, minACV,currentTime,beforeTime);
                }
                };

                function render(dataOne, dataTwo, maxOne, minOne, maxTwo, minTwo,maxX,minX) {
                // 指定图表的配置项和数据
                var option = {
                        color: ['#4bc4ff', '#8d7edd'],
                        tooltip: {
                        trigger: 'axis'
                        },
                        legend: {
                        show: true,
                        data: ['DC VOL', 'AC VOL'],
                        icon: 'rect',
                        itemWidth: 14,
                        itemHeight: 2,
                        itemGap: 13,
                        right: '0%',
                        top: '5%',
                        textStyle: {
                            fontSize: 10,
                            fontFamily: 'exoDemiBold'
                        }
                        },
                        grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                        },
                        xAxis: {
                        type: 'time',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        boundaryGap: false,
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        splitLine:{
                            show: false
                        },
                        max: maxX,
                        min: minX
                        },
                        yAxis: [{
                        type: 'value',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        name: '(V)',
                        nameTextStyle: {
                            fontSize: 12,
                            fontFamily: 'exoDemiBold'
                        },
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        max: maxOne,
                        min: minOne,
                        splitLine: {
                            lineStyle: {
                            type: 'solid',
                            }
                        }
                        }, {
                        type: 'value',
                        //去掉y轴
                        axisLine: {show: false},
                        //去掉y轴分割线
                        axisTick: {show: false},
                        position: 'right',
                        axisLabel: {
                            color: '#B3B5B7'
                        },
                        max: maxTwo,
                        min: minTwo,
                        splitLine: {
                            show: false,
                        }
                        }],
                        series: [{
                            name: 'DC VOL',
                            data: dataOne,
                            type: 'line',
                            showSymbol: false,
                            smooth: true,
                            itemStyle: {
                            normal: {
                                shadowColor: 'rgba(255,255,255,.6)',
                                shadowBlur: 20
                            }
                            }
                        },
                        {
                            name: 'AC VOL',
                            data: dataTwo,
                            type: 'line',
                            yAxisIndex: 1,
                            showSymbol: false,
                            smooth: true,
                            itemStyle: {
                            normal: {
                                shadowColor: 'rgba(255,255,255,.6)',
                                shadowBlur: 20
                            }
                            }
                        }
                        ]
                    };
                // 使用刚指定的配置项和数据显示图表。
                myChart4.setOption(option,true);
                // window.onresize=function(){
                // myChart4.resize();
                // }
                }
            }

        },

    }
}
</script>

<style lang="stylus">
.el-progress__text{
    font-size:12px !important
}
.el-progress-bar{
    margin-right: -55px !important;
    width: 80% !important;
}
body{

-webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}
.readTimeData

    font-weight normal
    position relative
.showbox
    height 100%
    width 100%
    background rgba(17,22,30,0.4)
    position fixed
    left 0
    bottom 0px
    z-index 999
    .showModal
        width 100%
        height 93%
        background #fff
        position absolute
        top 7%
        left 0
        .icon
            position absolute
            right 1.5%
            top 1%
            font-size 30px
            cursor pointer
            z-index 999
        .showName
            width 100%
            height 100px 
            line-height 100px
            font-size 30px
            font-weight bold
        .showleft
            width 58%
            height 90%
            float left
            border-right 1px solid #eee
            // padding-left 20px
        .showright
            width 42%
            height 90%
            float right
 .slide-fade-enter-active 
    transition: all 0.3s ease;
.slide-fade-enter, .slide-fade-leave-to
    transform: translateY(1200px);
    opacity: 1;   
.readtop
    width 100%
    height 10%
    background-color #fff
    // border 1px solid #eee
    font-size 15px
    z-index 1
    position absolute
.circle
    right 110px
    width 10px
    height 10px
    border-radius 50%
.readcenter
    width 100%
    height 15%
    background-color #fff
    text-align center
    border-top 1px solid #eee
    border-bottom 1px solid #eee
    .readtext
        height 50%
        font-size 3rem
        color #1D2531 
        padding-top 1rem
    .readtext1
        height 50%
        width 100%
        color #A8B1C0
        padding-top 1.2rem
        p
          text-align center
.readcontent
    background-color #fff
    height: 75%
    .readcontent-name
        width 100%
        height 10%
        line-height 3rem
        font-size 1.5rem
        color #A8B1C0
        .ivu-col
          padding 0 10px
    .readnext
        width 100%
        height 10%
        color #1D2531
        font-size 1.5rem
        .ivu-col
          padding 0 10px
.el-progress.progress1.el-progress--line.el-progress--text-inside .el-progress-bar__outer
    border-radius: 0;
    border-bottom: 2px solid #0f77d0;
    background none
.el-progress.progress1.el-progress--line.el-progress--text-inside .el-progress-bar__inner
    background #64A4ED
    border-radius: 0;
.el-progress.progress2.el-progress--line.el-progress--text-inside .el-progress-bar__outer
    border-radius: 0;
    border-bottom: 2px solid #FCA431;
    background none
.el-progress.progress2.el-progress--line.el-progress--text-inside .el-progress-bar__inner
    background #FECC8C
    border-radius: 0;
.el-progress.progress3.el-progress--line.el-progress--text-inside .el-progress-bar__outer
    border-radius: 0;
    border-bottom: 2px solid #7EB131;
    background none
.el-progress.progress3.el-progress--line.el-progress--text-inside .el-progress-bar__inner
    background #A4C86E
    border-radius: 0;
.el-progress.progress4.el-progress--line.el-progress--text-inside .el-progress-bar__outer
    border-radius: 0;
    border-bottom: 2px solid #FB7E6C;
    background none
.el-progress.progress4.el-progress--line.el-progress--text-inside .el-progress-bar__inner
    background #FFC3BB
    border-radius: 0;
.progresstext
    position absolute
    top 10px
    left 20px
    color #333
    font-size 12px
    // transform: translate(0,-50%);
.bigcircle.suppercircle 
    background rgba(179,168,232,0.7)
.bigcircle
    width 5rem
    height 5rem
    border-radius 50%
    background rgba(93,156,206,0.7)
    position absolute 
    top -1%
    right 1%
    .textinner
        position absolute
        top 50%
        left 50%
        color #fff
        font-size 15px
        transform: translate(-50%,-50%);
.readechart
    width 100%
    height 50%
    background-color #fff
#readechart-left1
    width 25%
    height 100%
    float left
#readechart-left2
    width 25%
    height 100%
    float left
#readechart-left3
    width 25%
    height 100%
    float left
#readechart-left4
    width 25%
    height 100%
    float left


</style>
