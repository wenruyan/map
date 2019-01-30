<template>
  <div class="login" @keyup.13="login">
    <div class="content tvac">
      <div class="left">
        <div class="logo"></div>
        <p>Welcome to System</p>
      </div>
      <div class="right">
        <h3>Storage Operating System</h3>
        <p>Username</p>
        <Input v-model="inputUsername" placeholder="Enter username" />
        <p>Password</p>
        <Input v-model="inputPassword" placeholder="Enter password" :type="psdInputType" icon="md-eye" @on-click="changePsdInputType" />
        <label>
          <input type="checkbox" v-model="remember" @change="changeRemember">Remember me</input>
          <b></b>
        </label>
        
        <transition name = "el-fade-in">
          <p v-show = "tipShow" class="tip">{{ tip }}</p>
        </transition>
        <div class="bottom">
          <Button type="primary" long @click="login">Login</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'Login',
      created() {

      },
      data () {
        return {
          inputUsername: '',
          inputPassword: '',
          psdInputType: 'password',
          tip: '',
          tipShow: false,
          remember: false
        }
      },
      methods: {
        changePsdInputType(){
          this.psdInputType = this.psdInputType == 'text' ? 'password' : 'text';
        },
        showTip(str){
          this.tip = str;
          this.tipShow = true;
          setTimeout(() => {
            this.tipShow = false;
          }, 2000);
        },
        login(){
          let name = this.inputUsername;
          let psd = this.inputPassword;
          let that = this;
          if(!name){
            this.showTip('User name cannot be empty');
          }
          else if(!psd){
            this.showTip('Password cannot be empty');
          }
          else {
              let form = new FormData();
              form.append("username", name);
              form.append("password", psd);
              form.append("grant_type", "password");
              this.$axios
              ({
                "url":this.$store.state.api +  "/auth/oauth/token",
                "method": "POST",
                "headers": {
                  "Authorization": "Basic YnJvd3NlcjoxMjM=",
                  "Cache-Control": "no-cache",
                },
                "data": form
                })
              .then((response) => {
                let token = response.data.access_token
                this.$axios({
                  "url":this.$store.state.api +   "/auth/logoAddress",
                  "method": "GET",
                  "headers": {
                  "Authorization": "Bearer " + token,
                },
                 }).then((response) => {
                  let img = response.data
                  this.$store.state.logoImg = img
                     sessionStorage['getLogoImg'] = this.$store.state.api + '/' +'auth/logo' + '/' + this.$store.state.logoImg;
                     that.$router.push({ 
                      path: '/Product' 
                    });
                 })
                
                sessionStorage.setItem("openNum", '1-1');
                sessionStorage.setItem("orderOpenNum", '1');
                sessionStorage.setItem("name", name);
                if(that.remember){
                  localStorage.setItem("name", name);
                  localStorage.setItem("psd", psd);
                  localStorage.setItem("remember", that.remember);
                }
              }).catch(function (param) {  
                that.showTip('Error Incorrect username or password');    
              });
                 
          }
        },
        changeRemember(){
          if(this.remember){
            localStorage.setItem("remember", this.remember);
          } else {
            localStorage.clear();
          }
        }
      },
      mounted(){
        if(localStorage.getItem('remember')){
          this.inputUsername = localStorage.getItem('name');
          this.inputPassword = localStorage.getItem('psd');
          this.remember = true;
        }
      }

    }
</script>


<style>
.login {
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: #EFF3F6;
}
.login .content {
  height: 40%;
  width: 600px;
  box-shadow: 10px 10px 10px #ccc;
  color: #fff;
}
.login .content .left,.login .content .right {
  height: 100%;
  float: left;
  padding: 15px;
}
.login .content .left {
  width: 40%;
  background-color: #0063AD;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.login .content .right {
  width: 60%;
  background-color: #222C3C;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  position: relative;
  text-align: left;
}
.login .content .left .logo {
  width: 40px;
  height: 40px;
  /* background-image: url('../../assets/login_logo.png'); */
  background-size: contain;
  background-repeat: no-repeat;
}
.login .content .left p {
  margin: 40px 0;
  text-align: left;
  font-size: 18px;
}
.login .content .left span {
  display: inline-block;
  width: 100%;
  text-align: left;
}
.login .content .right h3 {
  margin-bottom: 40px;
  text-align: center;
}
.login .content .right p {
  text-align: left;
  margin: 20px 0 10px 0;
}
.login .content .right input {
  width: 100%;
  background: none;
  border: 1px solid rgba(255,255,255,.1);
  color: #fff;
}
.login .content .right input::-webkit-input-placeholder {
  color: rgba(255,255,255,.2);
}
.login .content .right input:focus {
  border-color: #0063AD;
  box-shadow: none;
}
.login .content .right i {
  cursor: pointer;
}
.login .content .right>label {
  position: relative;
  width: 100%;
  padding-left: 20px;
  display: inline-block;
  margin: 20px 0;
  height: 12px;
  line-height: 12px;
  color: rgba(255,255,255,.8);
}
.login .content .right label input {
  position: absolute;
  left: 0;
  top: 0;
  width: 0px;
  height: 0px;
  border: none;
}

.login .content .right label b {
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: 12px;
  border: 1px solid rgba(200,200,200,.3);
  background-color: #222C3C;
  z-index: 1;
  cursor: pointer;
  border-radius: 1px;
}
/* 单选框选中效果 */
.login .content .right label input:checked+b:before {
  content: '¬';
  position: absolute;
  top: 0px;
  left: 8px;
  width: 3px;
  height: 8px;
  border: solid rgba(0, 0, 0, 0);
  border-width: 0 2px 2px 0;
  transform: rotate(135deg);
  color: rgba(255,255,255,1);
}


.login .content .right .bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 50px;
  width: 100%;
  background-color: #273142;
  padding: 0 15px;
}
.login .content .right .bottom button {
  height: 30px;
  margin-top: 10px;
  padding: 0;
  background-color: #0063AD;
  border: none;
}
.login .content .right .tip {
  text-align: center;
  color: #fff;
  margin: 0;
}
.login .content .right .bottom button span {
  display: inline-block;
  height: 100%;
  line-height: 30px;
}

#inputStyle1 .ivu-input,#inputStyle2 .ivu-input {
  height:50px !important
}

</style>

 