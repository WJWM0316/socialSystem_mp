## 多多社交招聘系统开发文档
备足说明：此项目采用小程序原生开发，开启eslint规则，项目结构分明，采用分包机制，需注意页面存放位置

### 主要的目录结构
> README.md  开发文档

> config 配置文件， 用于api的host,或者其他链接定义

>  api 

> > pages 按模块划分api 
    
> > require 请求中间层
    
>  components

> > business 业务组件文件夹， 主要存放业务组件，如各类选项卡、头部、底部、各种内容模块

> > functional 功能组件文件夹， 主要存放功能性组件，如上传组件、截图组件、多媒体组件、选择器组件

> > layout 基本布局文件夹，主要存放一些小部件，如空白数据展示组件、返回顶部组件等等

> images 本地开发存放图片


> page

> > applicant  求职者端 页面文件

> > common 公共页面文件

> > recruiter 招聘者端 页面文件

> utils 各类js封装文件夹
>

### config 配置文件说明
ps: 主要用来配置小程序需要的一些公共变量以及api host, 开发需要的页面路径尽量使用config定义的字段

### app.js 文件说明
``` javascript
globalData: {
    identity: 'APPLICAN', // 身份标识
    hasLogin: false, // 判断是否登录
    userInfo: null, // 用户信息， 判断是否授权
    navHeight: 0,
    cdnImagePath: 'https://attach.lieduoduo.ziwork.com/images',
    systemInfo: wx.getSystemInfoSync() // 系统信息
}
```


### 组件使用
**1.auth ----- 授权组件**
在需要授权的页面引入授权组件，需要在onLoad里写上以前代码，在授权回调那里请求页面数据

``` javascript  
getApp().checkLogin().then(res => {
   console.log(res) // 数据请求返回用户信息之后再发送请求
})
```

**2.avatarCut ----- 头像裁剪组件**

+ 传值 
src ： String类型， 用于展示默认图

+ 自定义方法

bindresultEvent ： 用于父组件接收结果

**3.myPicker ----- 自定义的picker选择器， 基本包含项目所有选择器**

+ 传值 

    + pickerType：pick类型， String， value值如下：
      - startTime - 开始时间， 格式： XXXX年XX日
      - endTime- 结束时间， 格式： XXXX年XX日 
      - workTime- 开始工作时间，格式： XXXX年XX日
      - dateTime-选择面试时间，格式： XXXX年XX日XX日 XX:XX
      - birthday-生日时间， 格式： XXXX年XX日XX日
      - education-选择学历
      - sex-选择性别
      - jobStatus-求职状态
      - experience-经验要求
      - staffMembers-公司人员规模
      - financing-公司融资情况
      - salaryRangeC-求职者端的薪资范围，格式： 2k~3k
      - salaryRangeB-招聘者端的薪资范围，格式： 2k~3k

    + setResult：String类型，picker的默认值设置，按照实际具体的字符串传入即可，一定要跟选择器选择展示的字符串一致才可

+ 自定义方法 

bindresultevent ： 获取上传结果

``` html
<myPicker pickerType="dateTime" setResult="2018年12月17日 13:22" bindresuleEvent="getResult"></myPicker>
```

**4.myCalendar ----- 自定义日历组件**

+ 传值

    + calendarType ： String类型
      - normal - 常规日历
      - roll  - 横向滚动日历

    + switchable ： Boolean类型， 是否需要两种日历相互切换

    + setDateList ： Array类型， 用于标注需要的日期

    + isClick : Boolean类型， 是否可以点击选择日期， 默认值true

+ 自定义方法 bindresultEvent  获取选择日期的结果 

**5.unloadFile ----- 上传组件**

+ 传值 

  + url : String类型， 默认数据

  + unloadType ： 上传类型， String， value值如下：
   
+ 自定义方法 bindresultEvent  获取上传结果  

