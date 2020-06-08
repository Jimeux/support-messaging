<template>
  <div v-if="messages.activeUser != null">
    <div class="pa-3" style="text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <v-list-item-avatar size="100px">
        <v-img :src="messages.activeUser.avatar"></v-img>
      </v-list-item-avatar>
      <div class="mt-2 mb-1">{{messages.activeUser.name}}</div>
      <small class="mb-2 grey--text">Active 10 minutes ago</small>
    </div>
    <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.12);" class="pl-1">
      <v-list style="background: transparent;">
        <v-list-item dense
                     v-for="item in [
                          {title: messages.activeUser.location, icon: 'location_on', color: 'pink'},
                          {title: messages.activeUser.id, icon: 'fingerprint', color: 'primary'},
                          {title: messages.activeUser.gender, icon: 'wc', color: 'primary'},
                          {title: messages.activeUser.registrationDate.split('T')[0], icon: 'event', color: 'primary'},
                      ]"
                     :key="item.title"
        >
          <v-list-item-icon>
            <v-icon v-if="item.icon" :color="item.color">{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div>
      <v-expansion-panels flat>
        <v-expansion-panel style="border-bottom: 1px solid rgba(255, 255, 255, 0.12); background: transparent;">
          <v-expansion-panel-header disable-icon-rotate>
            Profile
            <template v-slot:actions>
              <v-icon>portrait</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{messages.activeUser.profile}}}
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel style="background: transparent;">
          <v-expansion-panel-header disable-icon-rotate>
            Notes
            <template v-slot:actions>
              <v-icon>note</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{messages.activeUser.notes}}}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import {MessageState, MessageNamespace} from "@/store/modules/messages";

@Component({
  components: {
  },
  computed: {...mapState([MessageNamespace])},
  methods: {...mapActions(MessageNamespace, [])}
})
export default class MessageUserInfoPane extends Vue {
  messages!: MessageState;
}
</script>
