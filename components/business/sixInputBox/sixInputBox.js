// component.js
Component({

  // 组件属性
  properties: {

    //输入框密码位数
    value_length: {
      type: Number,
      value: 0,
      // 监听输入框密码变化
      observer(newVal, oldVal) {
        let input_value = this.data.input_value
        this.triggerEvent('resultEvent', input_value)
      }
    },

    // 是否显示间隔输入框
    interval: {
      type: Boolean,
      value: true,
      observer (newVal, oldVal) {}
    },

    // 是否获取焦点
    isFocus: {
      type: Boolean,
      value: true,
      observer (newVal, oldVal) {}
    },

    //输入框聚焦状态
    get_focus: {
      type: Boolean,
      value: false,
      observer (newVal, oldVal) {}
    },
    //输入框初始内容
    input_value: {
      type: String,
      value: "",
      observer (newVal, oldVal) {}
    },
    //输入框初始内容
    classErrorName: {
      type: String,
      value: "",
      observer (newVal, oldVal) {}
    },
    //输入框格子数
    value_num: {
      type: Array,
      value: [1, 2, 3, 4, 5, 6],
      observer (newVal, oldVal) {}
    }
  },

  // 组件方法
  methods: {

    // 获得焦点时
    get_focus() {
      this.setData({isFocus: true })
    },

    // 点击聚焦
    set_focus() {
      this.setData({isFocus: true })
    },

    // 获取输入框的值
    get_value(data) {
      // 设置空数组用于明文展现
      let val_arr = [];
      // 获取当前输入框的值
      let now_val = data.detail.value
      // 遍历把每个数字加入数组
      for (let i = 0; i < 6; i++) {
        val_arr.push(now_val.substr(i, 1))
      }
      // 获取输入框值的长度
      let value_length = data.detail.value.length;
      // 更新数据
      this.setData({
        value_length: value_length,
        val_arr: val_arr,
        input_value: now_val
      });
    },
  }
})
