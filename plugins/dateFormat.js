import Vue from 'vue'
import dayjs from 'dayjs'

// 设置日期格式处理全局过滤器
Vue.filter('date', (value, format = 'YYYY-MM-DD') => {
  return dayjs(value).format(format)
})