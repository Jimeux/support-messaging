<template>
  <v-app>
    <!--<v-app-bar
        app
        src="https://picsum.photos/1920/1080?random"
    >
      <template v-slot:img="{ props }">
        <v-img
            v-bind="props"
            gradient="to top right, rgba(55,236,186,.9), rgba(25,32,72,.8)"
        ></v-img>
      </template>
      <v-toolbar-title>Support</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs align-with-title color="white">
          <v-tab @click="$router.push('/')">Messages</v-tab>
          <v-tab @click="$router.push('about')">Notifications</v-tab>
        </v-tabs>
      </template>

    </v-app-bar>
-->
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from "vue-property-decorator";

@Component
export default class App extends Vue {
}
</script>
