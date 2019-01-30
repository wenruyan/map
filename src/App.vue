<template>
  <div id="app" class="tac" style="height: 100%">
    <router-view/>
  </div>
</template>

<script>
export default {
  method(){

  }
}
</script>

<style>
  @charset "UTF-8";
/*css 初始化 */
html, body, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, fieldset, legend, img, button { margin:0; padding:0; }
fieldset, img,input,button { border:none; padding:0;margin:0;outline-style:none; }   /*去掉input等聚焦时的蓝色边框*/
ul, ol { list-style:none; }
input { padding-top:0; padding-bottom:0; font-family: "SimSun","宋体";}
select, input { vertical-align:middle;}
select, input, textarea { font-size:12px; margin:0; }
button {  border: 0px;outline: none;  }

textarea { resize:none; } /*防止拖动*/
img {border:0; vertical-align:middle; }  /*  去掉图片低测默认的3像素空白缝隙，或者用display：block也可以*/
table { border-collapse:collapse; }
html {
  font-size: 62.5%;
}
#app {
    font:1.6rem "Microsoft YaHei",
    Verdana,
    "\5b8b\4f53";
    width: 100%;
    max-width: 1920px;
    overflow: hidden;
}
@media (max-width: 1024px) {
  #app {
    font-size: 1.2rem;
  }
  html {
    font-size: 53.5%;
  }
}
.clearfix::before,.clearfix::after {  /*清除浮动*/
    content:"";
　　height:0;
　　line-height:0;
　　display:block;
　　visibility:hidden;
　　clear:both;
}
.clearfix{
    *zoom:1;/*IE/7/6*/
}
a {color:#fff; text-decoration:none; }
h1,h2,h3,h4,h5,h6 {text-decoration:none;}  /*设置h标签的大小，设置跟父亲一样大的字体font-size:100%;*/
s,i,em{font-style:normal;text-decoration:none;}

/* 水平居中 */
.tac {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/* 垂直居中 */
.tvc {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
/* 垂直水平居中 */
.tvac {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
/* 左浮动 */
.fl {
  float: left;
}
/* 右浮动 */
.fr {
  float: right;
}
</style>
