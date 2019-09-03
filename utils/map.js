const QQMapWX = require('../vendor/lib/qqmap-wx-jssdk.min.js')

const qqmapsdk = new QQMapWX({
  key: 'TMZBZ-S72K6-66ISB-ES3XG-CVJC6-HKFZG'
})

const app = getApp()

export const reverseGeocoder = (res) => {
	return new Promise((resolve, reject) => {
		qqmapsdk.reverseGeocoder({
	    location: {
	      latitude: res.latitude,
	      longitude: res.longitude
	    },
	    success(res) {
	    	resolve(res)
	    },
	    fail(res) {
	    	reject(res)
	    }
	  })
	})
}

export const mapInfos = {
	markers: [],
  polyline: [],
  controls: [
    {
      id: 1,
      iconPath: `${app.globalData.cdnImagePath}location.png`,
      position: {
        left: 0,
        top: 300 - 30,
        width: 30,
        height: 30
      },
      clickable: true
    }
  ],
  enableScroll: true
}