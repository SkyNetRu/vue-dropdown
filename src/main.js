import Vue from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown, faChevronUp, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import styles from './assets/scss/main.scss';

library.add(faChevronDown, faChevronUp, faTimes, faCheck);
// library.add(faChevronUp);
// library.add(faTimes);
// library.add(faCheck);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

// This variable will hold the reference to
// document's click handler
let handleOutsideClick
Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation()
      const { handler, exclude } = binding.value
      let clickedOnExcludedEl = false
      let classnames = exclude.replace(/[\s.%]/g, '').split(',');
      if (e.target.getAttribute("class")) {
        e.target.getAttribute("class").split(' ').forEach((className) => {
          if (classnames.includes(className)) {
            clickedOnExcludedEl = true;
          }
        })
      }

      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]()
      }
    }
    // Register click/touchstart event listeners on the whole page
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
  },

  unbind () {
    // If the element that has v-closable is removed, then
    // unbind click/touchstart listeners from the whole page
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchstart', handleOutsideClick)
  }
})

new Vue({
  styles,
  render: h => h(App),
}).$mount('#app')
