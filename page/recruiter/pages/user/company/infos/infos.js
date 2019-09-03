import { getCompanyInfosApi } from '../../../../../../api/pages/company.js'

Page({
  data: {
  	companyInfo: {}
  },
  onLoad(options) {
    getCompanyInfosApi({id: options.companyId}).then(res => {
    		this.setData({companyInfo: res.data})
    	})
  }
})