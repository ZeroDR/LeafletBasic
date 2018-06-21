<template>
  <div class="map-panel">
    <div id="map"></div>
    <time-line start-time="2018/06/18 0:00:00" end-time="2018/06/25 0:00:00" :fun-back="timeCallback"></time-line>
  </div>
</template>
<script>
import MapHandle from '@/handle/Maphandle'
import TimeLine from '@/components/TimeLine'
import EnvironmentalUtil from '@/stand/EnvironmentalUtil'
import RequestHandle from '@/request'

export default {
  name: 'Main',
  data() {
    return {};
  },
  created() {},
  mounted() {
    MapHandle.render('map', this.loadMap);
  },
  methods: {
    loadMap() {
      console.log(1);
      const t = this;
      let dt = {
        "id": "LAYER_GS",
        "features": [{
          "geoType": "POINT",
          "attr": {
            "code": "27fc33a6-b08c-4cdb-82ff",
            "lc": "LAYER_GS",
            "lt": "LL",
            "vl": 93,
            "nm": "霸州市第三小学",
            "le": 2,
            "el": {
              context: "<div style='background:#ff0000;height:20px;width:20px;'></div>",
              height: 20,
              width: 20
            },
            "hd": true,
            "miu": "static/imgs/environmental/gs-g.png",
            "col": "#ff0000"
          },
          "geo": {
            "lng": 116.37,
            "lat": 39.94
          }
        }, {
          "geoType": "POINT",
          "attr": {
            "code": "27fc33a6-b08c-4cdb-82ff",
            "lc": "LAYER_GS",
            "lt": "LL",
            "vl": 93,
            "nm": "霸州市第三小学",
            "le": 2,
            "el": {
              context: "<div style='background:#ff0000;height:20px;width:20px;'></div>",
              height: 20,
              width: 20
            },
            "hd": true,
            "miu": "static/imgs/environmental/gs-g.png",
            "col": "#ff0000"
          },
          "geo": {
            "lng": 116.27,
            "lat": 39.94
          }
        }]
      };
      RequestHandle.request({
        ptype: 'GSCITYPOLLUTION',
        type: 'GET',
        pms: {},
        hasLocal: false
      }, result => {
        let dts = t.dataTransform(result.data, 'citygid', 'pointname', 'aqi', 'LL');
        dts && (MapHandle.loadedOverlay({
          id: 'LAYER_GS',
          type:'FeatureCollection',
          geometryType:'Point',
          features: dts
        }, { hasEvent: true, fcbClick: t.requestMarker }, { hasEvent: false, hasValue: false }));
      }, ex => {

      });
      //MapHandle.loadedOverlay(dt,{hasEvent: true, fcbClick: t.requestMarker},{hasEvent:false,hasValue:false});
      // setTimeout(function(){
      //   MapHandle.updateMarker('LAYER_GS','VMARKER');
      // },5000);
    },

    timeCallback(tm){
    },

    requestMarker(mk, callback) {
      callback(mk, `<div style="height:240px;width:320px">123456</div>`);
    },

    //数据转换 data:待转换数据 kf:唯一标识 vf:ValueField lt:点显示方式
    dataTransform(data, kf, df, vf, lt) {
      let rtValue = [];
      data.forEach(v => {
        let le = 0;
        switch (vf.toUpperCase()) {
          case 'AQI':
            le = EnvironmentalUtil.getAQILevelIndex(v[vf]);
            break;
          case 'SO2':
            le = EnvironmentalUtil.getSO2LevelIndex(v[vf]);
            break;
        }
        rtValue.push({
          type: 'Feature',
          properties: {
            code: v[kf],
            lt: lt,
            vl: v[vf],
            el: null,
            nm: v[df],
            le: le,
            hd: false, //le > 3,
            miu: 'static/imgs/environmental/gs-g.png', //16*16
            col: EnvironmentalUtil.getColorByIndex(le) || '#999'
          },
          geometry: {
            type:'Point',
            coordinates:[v.longitude,v.latitude]
          },
        });
      });
      return rtValue;
    },
  },
  components: { TimeLine }
};

</script>
<style scoped>
.map-panel,
#map {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

</style>
