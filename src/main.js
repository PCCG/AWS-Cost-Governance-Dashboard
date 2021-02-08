/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";

import "./plugins/element.js";
import "./plugins/composition-api";
import vuetify from "./plugins/vuetify";

import moment from "moment";

import router from "./router";
import store from "./store";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/styles/tailwind.css";

Vue.config.productionTip = false;

new Vue({
	router,
	vuetify,
	store,
	render: (h) => h(App),
}).$mount("#app");
