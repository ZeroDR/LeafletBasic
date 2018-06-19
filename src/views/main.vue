<template>
  <div class="map-panel">
    <div id="map"></div>
  </div>
</template>
<script>
import MapHandle from '@/handle/Maphandle'
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
          features: dts
        }, { hasEvent: true, fcbClick: t.requestMarker }, { hasEvent: false, hasValue: false }));
      }, ex => {

      });
      //MapHandle.loadedOverlay(dt,{hasEvent: true, fcbClick: t.requestMarker},{hasEvent:false,hasValue:false});
      // setTimeout(function(){
      //   MapHandle.updateMarker('LAYER_GS','VMARKER');
      // },5000);
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
          geoType: 'POINT',
          attr: {
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
          geo: {
            lng: v.longitude,
            lat: v.latitude
          },
        });
      });
      return rtValue;
    },
  },
  components: {}
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
