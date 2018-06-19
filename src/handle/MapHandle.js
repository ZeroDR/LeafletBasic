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
  features: [],
  popup: null,

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
    t.removeFeature(fsId);

    let lGroup = L.layerGroup();
    let stm = new Date();
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
          t.regiseEvent(vl, fcbClick, fcbMouse);
          break;
        case 'ML':
          let mi = t.createIconMarker(v);
          let ni = t.createNameMarker(v, true);
          lGroup.addLayer(mi);
          lGroup.addLayer(ni);
          t.regiseEvent(mi, fcbClick, fcbMouse);
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
    t.features.push({
      id: source.id,
      layer: lGroup
    });
    let etm = new Date();
    console.log(etm - stm);
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
    return L.marker([geo.lat, geo.lng], { icon: iconMarker, iconType: 'IMARKER', attributes: atr });
  },

  //创建ValueMarker
  createValueMarker(a) {
    let geo = a.geo;
    let atr = a.attr;
    let valueIcon = L.divIcon({
      iconType: 'VMARKER',
      className: 'marker-item',
      iconSize: L.point(32, 24),
      html: `<div style="border-radius:3px;color:${a.le > 3 ? '#fff' : '#333'};background-color:${atr.col}">${atr.vl || '--'}<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:${atr.col}; position: absolute;  margin-top:-2px;margin-left:8px"></div></div>`
    });
    return L.marker([geo.lat, geo.lng], { icon: valueIcon, iconType: 'VMARKER', attributes: atr });
  },

  //更新
  resetMarkerIcon(a, m) {
    let atr = a.attr;
    let ops = m.options;
    let icon = null;
    switch (ops.iconType) {
      case 'VMARKER':
        icon = L.divIcon({
          className: 'marker-item',
          iconSize: L.point(32, 24),
          html: `<div style="border-radius:3px;color:${a.le > 3 ? '#fff' : '#333'};background-color:${atr.col}">${atr.vl || '--'}<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:${atr.col}; position: absolute;  margin-top:-2px;margin-left:8px"></div></div>`
        });
        break;
      case 'IMARKER':
        icon = L.icon({
          iconUrl: atr.miu,
          iconSize: [16, 16],
          iconAnchor: [8, 0]
        });
        break;
    }
    icon && m.setIcon(icon);
  },

  //创建NameMarker
  createNameMarker(a, hasArrow) {
    let geo = a.geo;
    let atr = a.attr;
    let lth = atr.nm.length;
    let nameIcon = L.divIcon({
      className: 'marker-item-name',
      iconSize: L.point(lth > 2 ? lth * 16 : 48, 18),
      iconAnchor: [lth > 2 ? lth * 8 : 24, -18],
      html: `<div><span style="padding:0 5px;">${atr.nm || '--'}</span>${hasArrow ? `<div style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;margin-top:-26px;margin-left:${atr.nm.length * 8 - 9}px"></div>`:''}</div>`
    });
    return L.marker([geo.lat, geo.lng], { icon: nameIcon, iconType: 'NMARKER', attributes: atr });
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
    return L.marker([geo.lat, geo.lng], { icon: elIcon, iconType: 'EMARKER', attributes: atr });
  },

  //删除图层
  removeFeature(id) {
    const t = this;
    if (id) {
      let fs = t.getFeatureById(id);
      fs && fs.layer.clearLayers();
      t.features.splice(t.features.findIndex(v => v.id === id), 1);
    } else {
      t.features.forEach(l => {
        t.map.removeLayer(l.layer);
      });
      t.features = [];
    }
  },

  updateMarker(id, type) {
    const t = this;
    let fs = t.getFeatureById(id);
    let updateLayer = fs.layer.getLayers().filter(l => (l.options.icon.options.iconType === type));
    updateLayer.forEach(l => {
      t.resetMarkerIcon({ attr: { le: 2, col: '#00ff00', vl: parseInt(Math.random() * 100) } }, l);
    });
  },

  //根据图层标识获取图层对象
  getFeatureById(id) {
    return this.features.find(v => v.id === id);
  },

  //事件注册
  regiseEvent(mk, efc, efm) {
    const t = this;
    (efc && efc.hasEvent) && (mk.on('click', (e) => {
      efc.fcbClick(e, (e, res, sle) => {
        t.setMapPopup(mk, res, sle);
      });
    }));
    (efm && efm.hasEvent) && (mk.on('mouseover', (e) => {}).on('mouseout', (e) => {

    }));
  },

  //设置弹出框显示
  setMapPopup(mk, content, sle, fcbClose) {
    let p = mk.getPopup();
    !p ? mk.bindPopup(content).openPopup() : mk.setPopupContent(content);
    p && (p.on('popupclose', function(e) {
      alert(1);
    }));
  },

  //关闭弹出框
  closeMapPopup() {}
}
