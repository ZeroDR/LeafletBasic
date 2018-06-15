<template>
  <div class="map-panel">
    <div id="map"></div>
  </div>
</template>
<script>
  import MapHandle from '@/handle/Maphandle'

  export default {
    name: 'Main',
    data () {
      return {};
    },
    created(){},
    mounted(){
        MapHandle.render('map',this.loadMap);
    },
    methods:{
      loadMap(){
        console.log(1);
        const t = this;
        let dt = {
          "id":"LAYER_GS",
          "features":[{
          "geoType": "POINT",
          "attr": {
            "code": "27fc33a6-b08c-4cdb-82ff",
            "lc": "LAYER_GS",
            "lt": "LL",
            "vl": 93,
            "nm": "霸州市第三小学",
            "le": 2,
            "el": {
              context:"<div style='background:#ff0000;height:20px;width:20px;'></div>",
              height:20,
              width:20
            },
            "hd": true,
            "miu": "static/imgs/environmental/gs-g.png",
            "col": "#ff0000"
          },
          "geo": {
            "lng": 116.37,
            "lat": 39.94
          }
        }]
      };
        MapHandle.loadedOverlay(dt,{hasEvent: true, fcbClick: t.requestMarker},{hasEvent:false,hasValue:false});
      },
      requestMarker(){},
    },
    components:{}
  };
</script>
<style scoped>
  .map-panel,#map{
    height:100%;
    width:100%;
    margin:0;
    padding:0;
    overflow: hidden;
  }
</style>
