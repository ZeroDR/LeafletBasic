export default {
  development: [{
    site: 'http://117.119.97.150',//'http://gkpt.zq12369.com:8016',//'http://devgkptplat.zhiscity.com',//'http://gkpt.zq12369.com:8015',//http://117.119.97.150:8063
    port: ':8063',
    path: '/api'
  },{
    site: 'http://117.119.97.150',
    // site: 'http://10.6.80.93',
    port: '8061',
    path: '/servicePlatform'
  },{
    site: 'http://117.119.97.150',
    port: ':8063',
    path: '/724json'
  }],
  release: [{
    site: 'http://gkpt.zq12369.com',//
    port: ':8016',
    path: '/api'
  }, {
    site: 'http://117.119.97.150',
    port: ':8061',
    path: '/servicePlatform'
  },{
    site: 'http://117.119.97.150',
    // site: 'http://10.6.80.93',
    port: ':8066',
    path: '/'
  }],
  getRequestUrlByType(type){
    console.log(process.env.API_ROOT);
    let apiConfig = this.release;
    (process.env.API_ROOT === 'DEV' || process.env.API_ROOT === 'TEST') && (apiConfig = this.development);
    let url = undefined;
    let cf = undefined;
    switch (type.toUpperCase()) {
      case 'MONPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetMonitoringPointReal';
        break;
      case 'MONCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetMonitoringPointChart';
        break;
      case 'MONCHARTHISTORY':
        cf = apiConfig[0];
        url = cf.site + '/Monitoring_7_24/';
        break;
      case 'SENSEPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/FcStation/GetFcStationList';
        break;
      case 'SENSEPOLLUTIONHISTORY':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/FcStation/GetHourPollution';
        break;
      case 'XHPOLLUTION':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHbPointsMicro';
        break;
      case 'XHPOLLUTIONCHAR':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHistoriesMicro';
        break;
      case 'VOCPOLLUTION':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHbPointsVoc';
        break;
      case 'SENSECHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/FcStation/GetSingleStationInfo';
        break;
      case 'VOCCHART':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbHistory';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHistoriesVoc';
        break;
      case 'DUSTPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Dust/GetDustHourRanking_NEW';
        break;
      case 'DUSTCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Dust/GetDust24Hour_NEW';
        break;
      case 'VIDEOTAEGET':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Video/GetVideoDeviceInfo';
        break;
      case 'XHDUST':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHbPointsRaise';
        break;
      case 'XHDUSTCHAR':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + '/XhHb/GetXhHistoriesRaise';
        //url = 'http://devgkptplat.zhiscity.com/api/XhHb/GetXhHistoriesRaise'
        break;
      case 'STATICTARGET':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + '/enterprise/allInfo';
        break;
      case 'ENTERPRISE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Company/GetCompanyPointList';
        break;
      case 'ENTERPRISECHAR':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Company/GetCompanyDetai';
        break;
      case 'EMERGENCY':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/EmergencyPlan/GetEmergencyList';
        break;
      case 'SENSEBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/winterpre/GetWinterPreAirGis';
        break;
      case 'DUSTBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/winterpre/GetWinterPreDustGis';
        break;
      case 'ENTREPRISEBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/winterpre/GetWinterPreCompanyGis';
        break;
      case 'GSCITYPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetJjjAnd226MonitorList';
        break;
      case 'GSCITYPOLLUTIONCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Monitoring/GetJjjAnd226Detail';
        break;
      case 'MAINSIXPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/SixParamAir/GetSixParamAirList';
        break;
      case 'MAINSIXCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/SixParamAir/GetSixParamAirDetail';
        break;
      case 'WINTERPRE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/WinterPre/GetWinterPreTVocGis';
        break;
      case 'TOWNPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Town/GetTownList';
        break;
      case 'TOWNCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/Town/GetSingleTown';
        break;
      case 'GRIDPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/GridForecast/GetGridForecast';
        break;
      case 'GRIDCHAR':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/GridForecast/GetGridForecast';
        break;
      case 'ALLREPORT':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + '/mobile/selectCases';
        break;
      case 'ALLREPORTCHAR':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + '/mobile/caseInfo';
        break;
      case 'MAPGEOSEARCH':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '/MapBox/MapBoxData';
        break;
      case 'HISTORYDATA':
        cf = apiConfig[2];
        url = cf.site + cf.port + cf.path + '/';
        break;
    }
    return url;
  }
}
