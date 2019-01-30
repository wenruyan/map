<template>
    <div class="performance exceptHeader" ref="maxBox">
        <div class="head">
             <Menu mode="horizontal" theme="light"  :active-name="omNum" @on-select="choiseOmRouter" >
                <MenuItem name="3-1">
                    Site
                </MenuItem>
                <MenuItem name="3-2">
                    Calibration
                </MenuItem>
                <MenuItem name="3-3">
                    Real-time Data
                </MenuItem>
                <MenuItem name="3-4">
                    History Data
                </MenuItem>
                <MenuItem name="3-5">
                    History Alarm
                </MenuItem>
            </Menu>
        </div>
        <div class="perforcontent" :style="{'height':perforcontentHeight,'width':'100%'}" >
            <asset @changenum="changeOmNum"  v-if="omNum === '3-1'"></asset>
            <calibration @changenum="changeOmNum"  v-if="omNum === '3-2'" style="height:100%" :content-height="perforcontentHeightNum" :content-width="perforcontentWidthNum"></calibration>
            <readTimeData @changenum="changeOmNum"  v-if="omNum === '3-3'" :content-height="perforcontentHeightNum" :content-width="perforcontentWidthNum"></readTimeData>
            <historyData @changenum="changeOmNum"  v-if="omNum === '3-4'"></historyData>
            <historyAlarm @changenum="changeOmNum"  v-if="omNum === '3-5'"></historyAlarm>
        </div>
    </div>
</template>

<script>
import Asset from "../asset/Asset";
import Calibration from "../calibration/Calibration";
import ReadTimeData from "../readTimeData/ReadTimeData";
import HistoryData from "../historyData/HistoryData";
import HistoryAlarm from "../historyAlarm/HistoryAlarm";
export default {
    components:{Asset,Calibration,ReadTimeData,HistoryData,HistoryAlarm},
    data(){
        return{
          contentHeight: '',
          perforcontentHeight: '',
          contentWidth: '',
          perforcontentHeightNum: 0,
          perforcontentWidthNum: 0,
          omNum: "",
        }
    },
    mounted(){
      this.omNum = sessionStorage.getItem("omNum");  
      if(!this.omNum){
          this.omNum = '3-1';
      }     
      let h = this.$refs.maxBox.offsetHeight;
      this.contentHeight = (h - 60)+'px';
      this.contentWidth = this.$refs.maxBox.offsetWidth+'px';
      this.perforcontentHeight = (h - 110)+'px';
      this.perforcontentHeightNum = h - 110;
      this.perforcontentWidthNum = this.$refs.maxBox.offsetWidth;
      
    },
    methods:{
        choiseOmRouter: function(value) {
                this.omNum = value;
                sessionStorage.setItem("omNum", value);
                if(this.$store.state.echartsOne){
                    this.$store.state.echartsOne.close();
                }
                if(this.$store.state.echartsTwo){
                    this.$store.state.echartsTwo.close();
                }
                if(this.$store.state.echartsThree){
                    this.$store.state.echartsThree.close();
                }
                if(this.$store.state.readInfo){
                    this.$store.state.readInfo.close();
                }
                if(this.$store.state.readLeftTable){
                    this.$store.state.readLeftTable.close();
                }
                if (this.$store.state.stompClient != null) {
                    this.$store.state.stompClient.disconnect();
                }
            },
            changeOmNum(index) {
            },
    },
    computed: {
      selectSectionWidth(){
        return this.$store.state.selectSectionWidth;
      }
  },
  watch:{
    selectSectionWidth(){
      let that = this;
      if (!this.timerTwo) {
        this.timerTwo = true;
        setTimeout(function () {
          let h = that.$refs.maxBox.offsetHeight;
          that.contentHeight = (h - 60)+'px';
          that.contentWidth = that.$refs.maxBox.offsetWidth+'px';
          that.perforcontentHeight = (h - 110)+'px';
          that.perforcontentHeightNum = h - 110;
          that.perforcontentWidthNum = that.$refs.maxBox.offsetWidth;
          that.timerTwo = false;
        }, 400)
      }

    }
  }
}
</script>

<style >
.performance{
    height: 100%;
    width: 100%;
}
.performance .head{
    height: 50px;
    background-color: #fff;
    line-height: 50px;
    font-weight: bold;
    padding-left: 30px;
    
}
.performance .head ul {
    width: 80%;
}
.performance .nav-text.ivu-tabs-nav{
    height: 50px;
    line-height:36px;
    font-size: 16px;
}
.performance .ivu-tabs-nav-scroll{
    padding-left: 30px;
}
.ivu-tabs-bar{
    border: none;
    margin-bottom: 0px;
}
.performance .perforcontent{
    padding: 30px;
}
.ivu-menu-horizontal{
    height:50px !important;
    line-height: 50px !important
}
.ivu-menu-horizontal.ivu-menu-light:after{
    height:0
}
</style>


