
<template>
  <div class="headerTitle">
    <header>
      <div class="logo"><img :src="logoImg" alt=""></div>
      <div class="info">
        <Icon type="md-contact" @click="changeUserInfoShow" />
        <div class="userInfo" v-show="this.$store.state.showUserInfo">
          <Icon type="md-contact" />
           <p>{{ username }}</p>
          <button @click="logout">Logout</button>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
 
export default {
  name: 'HeaderTitle',
  data() {
    return {
      username: '',
      logoImg:''
    }
  },
  methods: {
    logout(){
      let that = this;
      this.$axios
      .get(this.$store.state.api + "/auth/oauth/logout")
      .then(function (res) {  
        sessionStorage.clear();
        that.$router.push({ path: '/' });
      })
      
    },
    changeUserInfoShow(event){
      this.$store.state.showUserInfo = !this.$store.state.showUserInfo;
      event = event || window.event;
      event.stopPropagation();
    }
  },
  mounted(){
    this.username = sessionStorage.getItem("name");
    let that = this;
    that.logoImg = sessionStorage.getLogoImg
    document.addEventListener("click", function(event) {
      that.$store.state.showUserInfo = false;
    });
  }
}
</script>

<style>
.headerTitle {
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 2;
}
.headerTitle header {
  border-bottom: 1px solid rgba(200, 200, 200, 0.2);
  position: relative;
  height: 60px;
  background-color: #fff;
  box-sizing: border-box;
}
.headerTitle header .info {
  position: absolute;
  right: 30px;
  height: 100%;
}
.headerTitle header .logo {
  position: absolute;
  left: 30px;
  line-height: 60px;
}
.headerTitle header .logo img{
  /* width: 100px; */
  height: 40px;
}
.headerTitle header i {
  font-size: 36px;
  line-height: 60px;
  cursor: pointer;
}
.headerTitle header .info .userInfo {
  position: absolute;
  width: 220px;
  height: 150px;
  right: 0;
  background-color: #fff;
  border: 1px solid #eee;
  z-index: 999;
  border-radius: 5px;
  text-align: center;
  word-wrap: break-word;
  padding: 10px;
  box-shadow: 0px 1px 1px #ddd
}
.headerTitle header .info .userInfo i {
  line-height: 40px;
  display: block;
  margin-bottom: 10px;
}
.headerTitle header .info .userInfo button {
  width: 80%;
  background-color: #269BF4;
  color: #fff;
  padding: 5px 0;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 10px;
}
.exceptHeader {
  box-sizing: border-box;
  padding-top: 60px;
}
</style>
