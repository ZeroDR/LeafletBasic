/**
 * Created by admin on 2018/4/27.
 * 涉及属性对象标准
 * 如:{geoType:'',attr:{code:'',lng:'',lat:'',vl:'',nm:'',lt:'',col:'',miu:'',le:''},geo:{lng:'',lat:''}}
 * 说明:
 * geoType:空间数据类别（点、线、面）
 * code:唯一标识
 * lng:经度
 * lat:纬度
 * vl:显示值
 * nm:名称
 * lc:图层名称(唯一标识)
 * el:{context:'',height:20,width:20}显示HTML标签，仅lt为EL时有效果
 * lt:图层类型(LL:两个Label ML:Marker和Label MI:Marker和Icon NL:NameLabel VL:ValueLabel)
 * col:状态颜色
 * miu:图标路径
 * le:污染等级
 * hd:是否警报(默认判断为污染等级，也可自定义)
 */
import L from 'leaflet'

export default {
  map: undefined,
  center: [39.95, 116.37],
  defaultZoom: 12,
  hasLoaded: false,
  layers: [],

  reset() {
    this.map = undefined;
    this.center = [39.95, 116.37];
    this.defaultZoom = 12;
  },

  render(el, callback) {
    this.map = L.map(el, {
      center: this.center,
      zoom: this.defaultZoom
    });

    this.loadTileLayer('GOOGLE', callback);
  },

  //加载底图
  loadTileLayer(type, callback) {
    const t = this;
    let tileUrl = undefined;
    switch (type.toUpperCase()) {
      case 'GOOGLE':
        tileUrl = 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}';
        break;
      default:
        break;
    }
    L.tileLayer(tileUrl).addTo(t.map).on('load', function() {
      !t.hasLoaded && (t.hasLoaded = true, callback());
    });
  },

  //加载覆盖物 a:属性 fcbClick:点击回调 fcbMouse:鼠标事件
  loadedOverlay(source, fcbClick, fcbMouse) {
    const t = this;
    let fs = source.features;
    let fsId = source.id;
    let lGroup = L.layerGroup();
    fs.forEach(v => {
      let atr = v.attr;
      if (atr.hd) {

      }
      switch (atr.lt) {
        case 'LL':
          let vl = t.createValueMarker(v);
          let nl = t.createNameMarker(v);
          lGroup.addLayer(vl);
          lGroup.addLayer(nl);

          vl.on('click',(e)=>{
            alert(1);
          });
          break;
        case 'ML':
          let mi = t.createIconMarker(v);
          let ni = t.createNameMarker(v, true);
          lGroup.addLayer(mi);
          lGroup.addLayer(ni);
          break;
        case 'MI':
          let io = t.createIconMarker(v);
          lGroup.addLayer(io);
          break;
        case 'VL':
          let vm = t.createValueMarker(v);
          lGroup.addLayer(vm);
          break;
        case 'NL':
          let nm = t.createNameMarker(v, true);
          lGroup.addLayer(nm);
          break;
        case 'EL':
          let el = t.createElementMarker(v);
          lGroup.addLayer(el);
          break;
      }
      t.map.addLayer(lGroup);
    });
    t.layers.push({
      id: source.id,
      layer: lGroup
    });
  },

  //创建IconMarker
  createIconMarker(a) {
    let geo = a.geo;
    let atr = a.attr;
    let iconMarker = L.icon({
      iconUrl: atr.miu,
      iconSize: [16, 16],
      iconAnchor: [8, 0]
    });
    return L.marker([geo.lat, geo.lng], { icon: iconMarker });
  },

  //创建ValueMarker
  createValueMarker(a) {
    let geo = a.geo;
    let atr = a.attr;
    let valueIcon = L.divIcon({
      className: 'marker-item',
      iconSize: L.point(32, 24),
      html: `<div style="border-radius:3px;color:#fff;background-color:${atr.col}">${atr.vl || '--'}<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:${atr.col}; position: absolute;  margin-top:-2px;margin-left:8px"></div></div>`
    });
    return L.marker([geo.lat, geo.lng], { icon: valueIcon });
  },

  //创建NameMarker
  createNameMarker(a, hasArrow) {
    let geo = a.geo;
    let atr = a.attr;
    let nameIcon = L.divIcon({
      className: 'marker-item-name',
      iconSize: L.point(atr.nm.length * 16, 18),
      iconAnchor: [atr.nm.length * 8, -18],
      html: `<div><span style="padding:0 5px;">${atr.nm || '--'}</span>${hasArrow ? `<div style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;margin-top:-26px;margin-left:${atr.nm.length * 8 - 9}px"></div>`:''}</div>`
    });
    return L.marker([geo.lat, geo.lng], { icon: nameIcon });
  },

  //创建自定义元素
  createElementMarker(a) {
    let geo = a.geo;
    let atr = a.attr;
    let el = atr.el;
    let elIcon = L.divIcon({
      iconSize: [el.width, el.height],
      iconAnchor: [el.width / 2, 0],
      html: el.context
    });
    return L.marker([geo.lat,geo.lng],{icon:elIcon});
  },
}
