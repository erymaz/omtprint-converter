import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from './stores'
import { router } from '@/router'
import Toast, { POSITION } from 'vue-toastification'

import './index.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    closeOnClick: false,
  })

app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event: Event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})

router.isReady().then(() => {
  app.mount('#app')
})
