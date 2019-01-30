<template>
  <div class="product" ref="maxBox">
    <!-- <select-aside></select-aside> -->
    <section class="selectSection" :style="{width:this.$store.state.selectSectionWidth+'px',overflow: 'hidden'}">
      <Layout :style="{height:'100%'}">
        <Content :style="{minHeight: '280px', background: '#EFF3F6', height:'100%',width:'100%',position:'relative'}">
          <header-title></header-title>
          <!-- <vpp-config  v-if="this.$store.state.selectedNum === '1-1-1'"></vpp-config>
          <lateral-response v-if="this.$store.state.selectedNum === '1-1-2'"></lateral-response>
          <message-monitoring v-if="this.$store.state.selectedNum === '1-1-3'"></message-monitoring>
          <history-statistics v-if="this.$store.state.selectedNum === '1-1-4'"></history-statistics> -->
          <!-- <performance v-if="this.$store.state.selectedNum === '1-2-1'"></performance> -->
          <performance ></performance>
        </Content>
      </Layout>
    </section>
  </div>
</template>

<script>
// import SelectAside from "../selectAside/SelectAside"
import HeaderTitle from "../headerTitle/HeaderTitle";
// import VppConfig from "./Vpp/vppConfig/VppConfig";
// import LateralResponse from "./Vpp/lateralResponse/LateralResponse";
// import MessageMonitoring from "./Vpp/messageMonitoring/MessageMonitoring";
// import HistoryStatistics from "./Vpp/historyStatistics/HistoryStatistics";
import Performance from "./OM/performance/Performance";
export default {
  name: 'Product',
  data() {
    return {
      openNum: "",
      contentHeight: '',
      contentWidth: '',
    }
  },
  components: {HeaderTitle,Performance },
  methods: {
    hideUserInfo(){
      this.$store.state.showUserInfo = false;
    }
  },
  mounted(){
    let that = this;
    if(sessionStorage.getItem("name")){
      this.openNum = sessionStorage.getItem("openNum"); 
      let h = this.$refs.maxBox.offsetHeight;
      this.contentHeight = (h - 60)+'px';
      this.$store.state.selectSectionWidth = this.$refs.maxBox.offsetWidth ;
      if(this.$store.state.webSocket){
        this.$store.state.webSocket.close();
      }
      if(this.$store.state.realTimeInterval){
        clearInterval(this.$store.state.realTimeInterval);
      }
    }

    window.onresize = () => {
      return (() => {
        if (!that.timer) {
          that.timer = true
          setTimeout(function () {
            if(that.$refs.maxBox.offsetWidth >= 1024){
              that.$store.state.selectSectionWidth = that.$refs.maxBox.offsetWidth ;
            }
            that.timer = false
          }, 400)
        }       
      })()
    }
  }
};
</script>

<style>
.product .selectAside li.product {
  color: #fff;
}

.product {
  width: 100%;
  height: 100%;
}
.product aside {
  width: 100px;
  height: 100%;
  background-color: #1d2531;
}
.product aside h1 {
  width: 100%;
  height: 100px;
  position: relative;
  cursor: pointer;
}
.product aside h1 img {
  width: 50px;
  height: 60px;
}
.product aside ul li {
  width: 100%;
  height: 100px;
  text-align: center;
  position: relative;
  /* cursor: pointer; */
  color: #808c9e;
}
.product aside ul li.active {
  color: #fff;
}
.product aside ul li i {
  font-size: 50px;
  line-height: 100px;
}
.product aside ul li p {
  position: absolute;
  bottom: 5px;
  text-align: center;
  width: 100%;
  font-size: 10px;
  -webkit-transform: scale(0.85);
}
.product section {
  position: absolute;
  /* left: 100px; */
  top: 0;
  height: 100%;
}
.product section.selectSection .ivu-layout-sider-children {
  padding-top: 20px;
}
.product section.selectSection .ivu-menu-submenu-title {
  padding: 0 24px;
}
.product section.selectSection .ivu-menu-submenu-title i {
  line-height: 35px;
}
.product section.selectSection .ivu-menu-vertical .ivu-menu-submenu-title-icon {
  top: 0;
}
.product section.selectSection .ivu-layout-sider ul li {
  padding: 0;
  line-height: 35px;
}

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  border-radius: 3px;
  float: left;
  position: relative;
  left: 20px;
}
.product .layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.product .ivu-layout-sider ul {
   background-color: #222C3C;
}
.product .ivu-layout-sider ul li {
  background-color: #222C3C;
}
/* elerealData */
.eleRealData {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 100%;
  z-index: 1000;
}
.eleRealData.goLeft {
  animation: goLeft 0.5s forwards;
}
.eleRealData.goRight {
  animation: goRight 0.5s forwards;
}
.eleRealData .eleRealDataContent {
  width: 80%;
  height: 100%;
  background-color: #eff3f6;
  position: absolute;
  left: 0;
}
.eleRealData .eleRealDataContent i.hideEleRealData {
  position: absolute;
  right: 30px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
}
.eleRealData .eleRealDataContent h3 {
  font-weight: normal;
  font-size: 18px;
  height: 60px;
  line-height: 60px;
  padding-left: 30px;
  border-bottom: 1px solid rgba(200, 200, 200, 0.2);
  background-color: #fff;
}
.eleRealData .eleRealDataContent .selectAsset {
  font-size: 16px;
  height: 50px;
  line-height: 50px;
  padding-left: 30px;
  border-bottom: 1px solid rgba(220, 222, 226, 0.8);
  background-color: #fff;
}
.eleRealData .eleRealDataContent .selectAsset .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  padding-right: 40px;
}

.eleRealData .eleRealDataContent .outterContent {
  padding: 30px;
  width: 100%;
}
.eleRealData .eleRealDataContent .innerContent {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
}
.eleRealData .eleRealDataContent .innerContent .ivu-row {
  position: absolute;
  width: 80%;
  top: 20px;
  box-sizing: border-box;
  z-index: 1;
}
.eleRealData .eleRealDataContent .innerContent .ivu-row h2 {
  font-size: 16px;
}
.eleRealData .eleRealDataContent .innerContent .ivu-col:first-child {
  text-align: center;
  line-height: 35px;
}
.eleRealData .eleRealDataContent .innerContent .ivu-col {
  margin-right: 35px;
}
.eleRealData #myChart {
  width: 100%;
  height: 40%;
  position: absolute;
  top: 30px;
}
@keyframes goLeft {
  from {
    left: 100%;
  }
  to {
    left: 0;
  }
}
@keyframes goRight {
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
}
</style>
