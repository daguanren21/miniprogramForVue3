import { createApp } from 'vue'
import './app.css'
import { IconFont } from '@nutui/icons-vue-taro';
import { useLogin } from './composables/use-login';
const pinia = createPinia()
const App = createApp({
  async onLaunch(options) {
    let { wxLogin } = useLogin()
    await wxLogin()
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(pinia)
App.component('IconFont', IconFont)
export default App
