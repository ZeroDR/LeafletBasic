<template>
  <div class="box">
    <div class="progressTime_control" @click="progressTimeClick" v-bind:style="{backgroundImage:`url(${progressBackgroundImage})`}" :title="progressTitle"></div>
    <div class="progressTime" style="z-index:9">
      <div>
        <p style=" float:left;margin-left:33px;opacity: 0;display: none;">{{startTime}}</p>
        <p style=" float:right;margin-right:33px;opacity: 0;display: none;">{{endTime}}</p>
      </div>
      <div class="time_slot" v-html="timeSolt" v-bind:class=""></div>
      <div class="progressTime_concent">
        <div class="scrollBarBox" @click="scrollBarClick" @mousemove="scrollBarMouseMove" @mouseover="scrollBarMouseOver" @mouseout="scrollBarMouseOut">
          <div id="scrollBar">
            <div class="scroll_Track" v-bind:style="{width:(leftThumb > 0 ? leftThumb + 2 : 0)+'px'}"></div>
            <div class="scroll_Thumb" v-bind:style="{marginLeft:(leftThumb > 0 ? leftThumb + 1 : 0)+'px'}">{{scrollThumb}}</div>
          </div>
        </div>
        <div class="timecode" v-html="htmlTimeCode" v-bind:style="{marginLeft:leftTimeCode+'px'}" v-show="hasTimeVode">{{timeCode}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TimeLine',
  data() {
    return {
      //Globe
      timeInterval: undefined,
      index: 0,
      speed: 1000,
      //ScrollStyle
      scrollThumb: undefined,
      scrollTrack: undefined,
      timeCode: undefined,
      timeSolt: undefined,
      progressTitle: '开始',
      progressBackgroundImage: '/static/imgs/timeline/play.png',
      leftScrollBar:36,
      //ScrollBar
      value: 0,
      maxValue: 40,
      step: 1,
      currentX: 0,
      leftTimeCode: 0,
      htmlTimeCode: undefined,
      leftThumb: 0,
      hasTimeVode: false
    }
  },
  props:['startTime','endTime','funBack'],
  created() {},
  mounted() {
    //this.ready("2017/07/29 0:00:00", "2017/08/10 0:00:00");
    this.ready();
  },
  methods: {
    ready() {
      // 开始时间
      let startDate = new Date(this.startTime);
      let Year = startDate.getFullYear();
      let Month = (startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
      let currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
      let Hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
      let Minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
      let weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let week = weekArray[new Date(startDate).getDay()];
      let indexStart2 = week + "  " + currentDate + " - " + Hours + ":" + Minutes;
      let indexStart3 = Hours + ":" + Minutes;
      let firstStart = Year + "-" + Month + "-" + currentDate;
      // 结束时间
      let endDate = new Date(this.endTime);
      let endYear = endDate.getFullYear();
      let endMonth = (endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1);
      let endcurrentDate = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
      let endHours = endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours();
      let endMinutes = endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes();
      let lastEnd = endYear + "-" + endMonth + "-" + endcurrentDate;
      this.scrollThumb = indexStart2;
      this.timeCode = indexStart3;
      // this.startTime = startTime;
      // this.endTime = endTime;

      let dateNum = this.getDateDiff(firstStart, lastEnd);
      let str = '';
      for (let i = 0; i < dateNum; i++) {
        let d1 = new Date(this.startTime);
        let d2 = new Date(d1);
        d2.setDate(d1.getDate() + i);
        let weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        let week = weekArray[new Date(d2).getDay()];
        let monthNum = d2.getDate() < 10 ? "0" + d2.getDate() : d2.getDate();
        str += `<p style="width: calc(${100/dateNum}% - 1px);float: left;line-height: 36px;border-left: 1px solid #ccc;margin: 0;text-align: center;cursor: pointer;font-size: 12px;">${week+' '+monthNum}</p>`;
      }
      this.timeSolt = str;
      //设置最大值
      let qdsjDate = new Date(this.startTime);
      let jssjDate = new Date(this.endTime);
      this.maxValue = Math.abs(qdsjDate - jssjDate) / 1000 / 60 / 60;
      if (this.value > this.maxValue) {
        console.log('给定当前值大于了最大值！');
        return;
      } else {
        this.getValue();
      }
    },

    getDateDiff(date1, date2) {
      let arr1 = date1.split('-');
      let arr2 = date2.split('-');
      let d1 = new Date(arr1[0], arr1[1], arr1[2]);
      let d2 = new Date(arr2[0], arr2[1], arr2[2]);
      return (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
    },

    getValue() {
      this.currentX = document.getElementById('scrollBar').offsetWidth * (this.value / this.maxValue);
    },

    setValue(aValue) {
      this.value = aValue;
      if (this.value >= this.maxValue) this.value = this.maxValue;
      if (this.value <= 0) this.value = 0;
      let elScroll = document.getElementById('scrollBar');
      this.leftThumb = this.value / this.maxValue * elScroll.offsetWidth;
    },

    setTimeLarge(value) {
      let start = this.startTime;
      let startDate = new Date(start);
      startDate.setHours(startDate.getHours() + 1 * value); //十五分钟为进度
      let month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
      let currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
      let Hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
      let Minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
      let Seconds = startDate.getSeconds() < 10 ? "0" + startDate.getSeconds() : startDate.getSeconds();
      let indexStart = startDate.getFullYear() + "/" + month + "/" + currentDate + " " + Hours + ":" + Minutes + ":" + Seconds;
      let weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let week = weekArray[new Date(startDate).getDay()];
      let indexStart1 = week + "  " + currentDate + " - " + Hours + ":" + Minutes;
      this.scrollThumb = indexStart1;
      if(this.funBack){
        this.funBack(Hours);
      }
    },

    setTimeSmall(value) {
      let start = this.startTime;
      let startDate = new Date(start);
      startDate.setHours(startDate.getHours() + 1 * value); //十五分钟为进度
      let Hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
      let Minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
      let indexStart = Hours + ":" + Minutes;
      let indexStart2 = Hours + ":" + Minutes;
      this.htmlTimeCode = indexStart2;
    },

    scrollBarClick(event) {
      let changeX = event.clientX - this.currentX;
      let elScroll = document.getElementById('scrollBar');
      this.currentValue = changeX - this.currentX - this.leftScrollBar;
      this.leftThumb = this.currentValue;
      if ((this.currentValue + 1) >= elScroll.offsetWidth) {
        this.leftThumb = elScroll.offsetWidth;
        this.value = this.maxValue;
      } else if (this.currentValue <= 0) {
        this.leftThumb = 0;
        this.value = 0;
      } else {
        this.value = Math.round(this.currentValue * this.maxValue / elScroll.offsetWidth);
      }
      this.index = this.value;
      this.setTimeLarge(this.value);
      this.setInterval(this.value);
    },

    progressTimeStop() {
      this.progressTitle = '开始';
      this.progressBackgroundImage = '/static/imgs/timeline/play.png';
      this.leftThumb = 0;
      this.value = 0;
      this.index = 0;
      this.speed = 1000;
      window.clearInterval(this.timeInterval);
      this.setTimeLarge(0);
      this.setInterval(0);
    },

    setInterval(index) {
      const t = this;
      window.clearInterval(t.timeInterval);
      if (t.progressTitle === "开始") {
        t.setValue(t.index);
        t.setTimeLarge(t.index);
      } else {
        t.timeInterval = window.setInterval(function() {
          if (t.index <= t.maxValue) {
            t.index += 1;
            t.setValue(t.index);
            t.setTimeLarge(t.index);
          } else {
            t.progressTimeStop();
          }
        }, t.speed);
      }
    },

    scrollBarMouseMove(event) {
      let changeX = event.clientX - this.currentX;
      let elScroll = document.getElementById('scrollBar');
      this.hasTimeVode = true;
      this.currentValue = changeX - this.currentX - this.leftScrollBar;
      this.leftTimeCode = this.currentValue - 28;
      if ((this.currentValue + 1) >= elScroll.offsetWidth) {
        this.leftTimeCode = elScroll.offsetWidth - 43;
        this.value = this.maxValue;
      } else if (this.currentValue <= 0) {
        this.leftTimeCode = -28;
        this.value = 0;
      } else {
        this.value = Math.round(this.currentValue * this.maxValue / elScroll.offsetWidth);
      }
      this.setTimeSmall(this.value);
    },
    scrollBarMouseOver() {
      this.hasTimeVode = true;
    },
    scrollBarMouseOut() {
      this.hasTimeVode = false;
    },
    progressTimeClick(event) {
      const t = this;
      if (t.progressTitle === '暂停') {
        t.progressTitle = '开始';
        t.progressBackgroundImage = '/static/imgs/timeline/play.png';
        window.clearInterval(this.timeInterval);
      } else {
        t.progressTitle = '暂停';
        t.progressBackgroundImage = '/static/imgs/timeline/pause.png';
        t.timeInterval = window.setInterval(function() {
          if (t.index <= t.maxValue) {
            t.index += 1;
            t.setValue(t.index);
            t.setTimeLarge(t.index);
          } else {
            t.progressTimeStop();
          }
        }, t.speed);
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width: 1036px;
  height: 36px;
  position:absolute;
  bottom:0;
  z-index:401;
}

.progressTime_control {
  float: left;
  width: 36px;
  height: 36px;
  background-image: url(/static/imgs/timeline/play.png);
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  outline: none;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: center;
}

.progressTime_control:before {
  content: '';
  width: 36px;
  height: 6px;
  background-color: #9D0300;
  position: absolute;
  left: 0;
  top: -6px;
}








/*#progressTime_control:after { content: ''; width: 0; height: 0; border: 8px solid transparent; border-left: 12px solid #fff; position: absolute; left: 50%; margin-left: -6px; top: 50%; margin-top: -8px; }*/

.progressTime_control:hover:after {
  border-left-color: #ccc;
}

.progressTime {
  /*filter: alpha(opacity=50); -moz-opacity: 0.5; -khtml-opacity: 0.5; opacity: 0.5;*/
  color: white;
  background: rgba(0, 0, 0, 0.45);
  width: 1000px;
  height: 36px;
  padding-top: 0px;
  padding-bottom: 0px;
  display: block;
  position: relative;
  float: left;
}

.progressTime_concent {
  width: 100%;
  height: 36px;
  margin: 0 auto;
  cursor: pointer;
}

.scrollBarBox {
  width: 100%;
  height: 6px;
  padding: 5px 0;
  position: absolute;
  top: -11px;
  background-color: transparent;
  z-index: 2;
}

#scrollBar {
  width: 100%;
  height: 6px;
  background-color: #d3d3d3;
  cursor: pointer;
  position: absolute;
  top: 5px;
}

.timecode {
  width: 56px;
  height: 24px;
  background-color: #9D0300;
  position: absolute;
  left: 0;
  top: -35px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}

.timecode:after {
  content: '';
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top: 5px solid #9D0300;
  position: absolute;
  left: 50%;
  bottom: -10px;
  margin-left: -5px;
}

.scroll_Track {
  width: 0px;
  height: 6px;
  background-color: #9D0300;
  transition: all ease-in-out .25s;
}

.scroll_Thumb {
  height: 24px;
  width: 100px;
  text-align: center;
  line-height: 24px;
  background-color: #fff;
  position: absolute;
  left: -25px;
  margin-top: -35px;
  cursor: pointer;
  color: #000;
  font-size: 12px;
  transition: all ease-in-out .25s;
}

.scroll_Thumb:after {
  content: '';
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top: 5px solid #fff;
  position: absolute;
  left: 20px;
  bottom: -10px;
}

</style>
