<template>
    <div class="calibration" ref="calibration">
        <div class="calitop">
            <!-- <Row type="flex" style="padding-left:2rem;height:30px;posotion:relative">
                <Col span="8" order="1"> -->
                <div class="selectSN tvc" style="left:30px">
                <span style="margin-right:5px">Station Name:</span>
                    <Select clearable :style="{width:$store.state.selectWidth}" v-model="stationModel" @on-change="selectStation">
                        <!-- :label="item.stationId" -->
                        <Option v-for="item in stationList" :value="item.stationId"  :key="item.stationId">{{ item.name }}</Option>
                    </Select>
                    </div>
                <!-- </Col> -->
                <!-- <Col span="11" order="2"> -->
                <div class="selectDN tvc" style="left:320px">
                <span style="margin-right:5px">Device Name:</span>
                    <Select clearable v-model="devModel" :style="{width:$store.state.selectWidth}" @on-change="selectDevice" style="z-index:99">
                        <Option v-for="item in deviceList" :value="item.deviceId" :key="item.deviceId">{{ item.name }}</Option>
                    </Select>
                    </div>
                <!-- </Col> -->
                <!-- <Col span="2" order="3" style="margin-right:20px"> -->
                <Modal
                    v-model="modal1"
                    title="Please enter the password to continue the operation"
                    @on-ok="ok"
                    @on-cancel="cancel">
                     <Input v-model="value" placeholder="Please enter password" style="width: 300px" />
                </Modal>
                
                <!-- </Col>
                <Col span="2" order="4"> -->
                <Modal
                    v-model="modal2"
                    title="Please enter the password to continue the operation"
                    @on-ok="ok1"
                    @on-cancel="cancel1">
                     <Input v-model="value" placeholder="Please enter password" style="width: 300px" />
                </Modal>
               
                <!-- </Col>
            </Row> -->
            <Button type="primary" class="tvc" style="right:140px;height:60%;max-height:36px;line-height:100%" @click="turnOff" >Turn off</Button>
             <Button type="primary" class="tvc" style="right:30px;height:60%;max-height:36px;line-height:100%" @click="turnOn">Turn on</Button>
        </div>
        <div class="calicontent">
          <div style="height:10%"></div>
            <div class="clileft">
                <div class="clilefttop">
                    <div id="clilefttop-left"></div>
                    <div id="clilefttop-right"></div>
                </div>
                <div class="clileftbottom">
                  <div id="clileftbottom-left" ></div>
                  <div id="clileftbottom-right" ></div>
                </div>
            </div>
            <div class="cliright" ref="cliright">
                <Table :columns="columns" :height="calicontentHeight" :data="tableData"></Table>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
     data(){
        return{
            chartTl: '',
            chartTr: '',
            chartBl: '',
            chartBr: '',
            calicontentHeight:'',
            stationList:[],
            modal1: false,
            modal2: false,
            value:'',
            stationName:'',
            stationModel:'',
            deviceList:[],
            deviceName:'',
            devModel:'',
            getDeviceId:'',
            tableData:[],
            // inputValue:'',
            aa:'',
            bb:'',
            columns: [
                    {
                        title: 'Name',
                        key: 'name',
                        align:'center',
                        // width:100
                    },
                    {
                        title: 'Value',
                        key: 'data',
                        align:'center',
                        // width:60
                    },
                    {
                        title: 'Unit',
                        key: 'unit',
                        align:'center',
                        // width:50
                    },
                    {
                        title: 'Range',
                        key: 'range',
                        align:'center'
                    },
                    {
                        title: 'Calibration',
                        key: 'input',
                        align:'center',
                        // width:100,
                        render: (h,params)=>{
                            return h('form',[
                                h('Input',{
                                    props:{
                                        type:'text',
                                        size:'small',
                                        placeholder:'Input number',
                                        value:params.row.input,
                                    },
                                    on: {
                                        input: (event)=>{
                                            // this.inputValue = event
                                            
                                             params.row.input = event
                                             this.bb = params.row.input
                                        }
                                    }
                                })
                            ])
                        }
                        
                    },
                    {
                        title: 'Send',
                        key: 'send',
                        align:'center',
                        render: (h,params)=>{
                            return h('form',[
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                    },
                                    style: {
                                        width: '80%',
                                        maxWidth: '120px',
                                        display: 'flex',
                                        'justify-content': 'center',
                                        margin: 'auto'
                                    },
                                    on: {
                                        click: (data,index,event) => {
                                            let aa = params.row.name
                                            let result = {}
                                            result[aa] = this.bb
                                            if(! this.bb){
                                                this.$Message.info('请输入数字');
                                            }else if(params.row.range == '/'){
                                                    this.bb = Number(this.bb)
                                                    if( typeof(this.bb) == 'number' && this.bb >=0 ){
                                                        if(isNaN(this.bb)){
                                                            this.$Message.info('请输入范围内数字');
                                                        }else{
                                                        this.$axios.post(this.$store.state.api + '/om/data/sendTelemeter/'+this.getDeviceId,result)
                                                        .then((response) => {
                                                                if(response.data.status == true){
                                                                    this.$Message.success('Sucess');
                                                                    params.row.data = this.bb
                                                                    $('input.ivu-input.ivu-input-small').val('')
                                                                    this.bb = ''
                                                                } 
                                                            
                                                        })
                                                        }
                                                        
                                                    }else{
                                                        this.$Message.info('请输入范围内数字');
                                                    }
                                                
                                            }else if(params.row.range != '/'){
                                                    let min = params.row.range.split('~')[0]
                                                    let max = params.row.range.split('~')[1]
                                                    this.bb = Number(this.bb)
                                                    min = Number(min)
                                                    max = Number(max)
                                                    //标定输入值数字校验
                                                    if(!isNaN(max)){
                                                        if(this.bb >= min && this.bb <= max){
                                                            this.$axios.post(this.$store.state.api + '/om/data/sendTelemeter/'+this.getDeviceId,result)
                                                            .then((response) => {
                                                                    if(response.data.status == true){
                                                                        this.$Message.success('Sucess');
                                                                        params.row.data = this.bb
                                                                        $('input.ivu-input.ivu-input-small').val('')
                                                                        this.bb = ''
                                                                    }
                                                                })
                                                        
                                                        }else{
                                                            this.$Message.info('请输入范围内数字');
                                                        }
                                                    }else{
                                                        if(this.bb <= min && this.bb >= 0){
                                                        this.$axios.post(this.$store.state.api + '/om/data/sendTelemeter/'+this.getDeviceId,result)
                                                        .then((response) => {
                                                                if(response.data.status == true){
                                                                    this.$Message.success('Sucess');
                                                                    params.row.data = this.bb
                                                                    $('input.ivu-input.ivu-input-small').val('')
                                                                    this.bb = ''
                                                                }
                                                            })
                                                    
                                                    }else{
                                                        this.$Message.info('请输入范围内数字');
                                                    }
                                                    }

                                                }
                                            
                                        },
                                        
                                    },
                                    }, 'send'),
                                                ])
                                            }
                                        },
                                    ],

        }
    },
    props: ['contentHeight','contentWidth'],
    mounted(){
        //获取站点
        let h = this.contentHeight;
        this.calicontentHeight = this.$refs.cliright.offsetHeight;
        this.$nextTick(function () { 
            this.getStation();
            this.getDevice();
          })
        
    },
    methods:{
        turnOff(){
             this.modal1 = true
             this.value = ''

        },
        turnOn(){
             this.modal2 = true
             this.value = ''

        },
        ok1 () {
            var onOnObj = ["Start_command"]
            if(this.value == '123'){
                this.$Message.info('Success');
                this.$axios.post(this.$store.state.api + 'om/data/telecontrol/'+this.getDeviceId,onOnObj)
                .then((response) => {
                })

                }else{
                    this.$Message.info('Error');
                    this.modal1 = true
                }               
            },
        cancel1 () {
            this.$Message.info('Cancel');
        },
        ok () {
            var onOffObj =["Stop_command"];
            if(this.value == '123'){
                this.$Message.info('Success');
                this.$axios.post(this.$store.state.api + '/om/data/telecontrol/'+this.getDeviceId,onOffObj)
                .then((response) => {
                })

            }else{
                this.$Message.info('Error');
                this.modal2 = true
            }
                
            },
        cancel () {
            this.$Message.info('Cancel');
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
                for( var i =0;i<response.data.length;i++){
                    this.deviceName = response.data[0].stationId
                    this.stationName = response.data[0].stationId
                    if(this.deviceName == this.stationName){
                        this.deviceList = response.data[0].deviceList;
                        if(this.deviceList != 0 ){
                            this.devModel = this.deviceList[0]['deviceId'];
                            this.getDeviceId = this.deviceList[0]['deviceId'];
                            
                        }   
                    }
                    
                } 
                this.drawlineone();
                this.drawlinethree();
                this.drawlinefour();
                this.getTable();

                
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
                                this.getDeviceId = ''
                                this.drawlineone();
                                this.drawlinethree();
                                this.drawlinefour();
                            }else{
                                this.devModel = this.deviceList[0]['deviceId'];
                                this.getDeviceId = this.deviceList[0]['deviceId'];
                            }
                                               
                        } 
                    
                } 
                this.drawlineone();
                this.drawlinethree();
                this.drawlinefour();
                this.getTable();
                
            })

        },
        selectDevice(value){    
            this.getDeviceId = value
            this.$nextTick(function () {  
                        this.drawlineone();
                        this.drawlinethree();
                        this.drawlinefour();
                        this.getTable();
                        })
                        
        },
        getTable(){
            this.$axios.get(this.$store.state.api + '/om/data/canWriteParameters/' + this.getDeviceId)
            .then((response) => { 
                this.tableData = response.data
                this.$axios.get(this.$store.state.api + '/om/data/telemeterData/' + this.getDeviceId)
                .then((response) => { 
                    let dataArr = response.data.result;
                        this.tableData.forEach(item => {
                            item.data = dataArr[item.name];
                        });   
                 })
                
            })
        },
        drawlineone (){
            let that = this
            let a;
            if(this.getDeviceId){
                a = this.getDeviceId;
                
            }else{
                a = ''
            }
            this.chartTl = document.getElementById('clilefttop-left');
            this.chartTr = document.getElementById('clilefttop-right');
            this.chartTl .removeAttribute("_echarts_instance_");//清除之前的echarts
            this.chartTr .removeAttribute("_echarts_instance_");//清除之前的echarts
            this.chartTl =  this.$echarts.init(this.chartTl);
            this.chartTr=  this.$echarts.init(this.chartTr);
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
                        
                    dataAP = this.common.judgeLength(dataAP,80);
                    }
                    if(dataSOC.length == 0){
                    dataSOC = this.common.judgeLength(dataSOC,80);
                    }
                    if(dataIa.length == 0){
                    dataIa = this.common.judgeLength(dataIa,80);
                    }
                    if(dataIb.length == 0){
                    dataIb = this.common.judgeLength(dataIb,80);
                    }
                    if(dataIc.length == 0){
                    dataIc = this.common.judgeLength(dataIc,80);
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
                    that.chartTl.setOption(option,true);
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
                    that.chartTr.setOption(option,true);
                }
            }
            

        },
        drawlinethree(){
            let that = this
            var a = this.getDeviceId;
            this.chartBl = document.getElementById('clileftbottom-left');
            this.chartBl.removeAttribute("_echarts_instance_");//清除之前的echarts
            this.chartBl=  this.$echarts.init(this.chartBl);
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
                that.chartBl.setOption(option,true);
                }
            }

        },
        drawlinefour(){
            let that = this
            var a = this.getDeviceId;
            this.chartBr = document.getElementById('clileftbottom-right');
            this.chartBr.removeAttribute("_echarts_instance_");//清除之前的echarts
            this.chartBr =  this.$echarts.init(this.chartBr);
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
                that.chartBr.setOption(option,true);
                }
            }

        },
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
            console.log('zeze');
            that.chartTl.resize();
            that.chartTr.resize();
            that.chartBl.resize();
            that.chartBr.resize();
            that.calicontentHeight = that.$refs.cliright.offsetHeight;
            that.timer = false;
          }, 400);
        }
      }
    }

}
</script>

<style  lang="stylus">
.calibration
    font-weight normal
    height: 100%
    position relative
.calitop
    width 100%
    height 10%
    background-color #fff
    border 1px solid #eee
    font-size 15px
    position absolute
    z-index 1
.calicontent
    width 100%
    height 100%
    background-color #fff
    .ivu-btn
      padding 5px 0 6px
.clileft
    width 100%
    height 40%
    float left
    border-right 1px solid #eee
    
    .clilefttop
        height 100%
        width 50%
        display flex
        float left
        #clilefttop-left
            width 50%
            height 100%
            float left
        #clilefttop-right
            width 50%
            height 100%
            float right
    .clileftbottom
        height 100%
        width 50%
        float left
        #clileftbottom-left
            width 50%
            height 100%
            float left
        #clileftbottom-right
            width 50%
            height 100%
            float right
.cliright
    width 100%
    height 50%
    background-color #FAFBFC
    float right
    td
      span
        overflow: hidden
        text-overflow:ellipsis
        white-space: nowrap
        display: inline-block
      .ivu-table-cell
        // padding-right: 0
        .ivu-input
          max-width 120px
    th
      overflow: hidden
      text-overflow:ellipsis
      white-space: nowrap
      .ivu-table-cell
        // padding-right: 0
        // padding-left: 0
    td:nth-child(1)
      max-width: 150px
    //   span
    //     min-width: 80px
    // th:nth-child(1)
    //   min-width: 80px
    // td:nth-child(2)
    //   min-width: 50px
    //   span
    //     min-width: 50px
    // th:nth-child(2)
    //   min-width: 50px
    // td:nth-child(3)
    //   min-width: 30px
    //   span
    //     min-width: 30px
    // th:nth-child(3)
    //   min-width: 30px
    // td:nth-child(4)
    //   min-width: 50px
    //   span
    //     min-width: 50px
    // th:nth-child(4)
    //   min-width: 50px
    // td:nth-child(5)
    //   min-width: 68px
    //   span
    //     min-width: 68px
    // th:nth-child(5)
    //   min-width: 68px
    // td:nth-child(6)
    //   min-width: 66px
    // th:nth-child(6)
    //   min-width: 66px
.ivu-table-wrapper
    border none
    table 
      width auto !important
</style>
