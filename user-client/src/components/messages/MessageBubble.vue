<template>
  <div :id="message.message.id" class="pl-2 pr-2">
    <div v-if="message.date != null" class="date-time">
      {{dateString}}
    </div>
    <v-row no-gutters dense>
      <v-col v-if="!message.message.fromUser" cols="3" class="pa-0 ma-0"></v-col>
      <v-col cols="9" class="pa-0 ma-0">
        <div :class="`d-flex ${bubbleClass} ${borderClass === 'only' ? 'only-top' : ''}`">
          <v-avatar class="d-flex" size="30" v-if="showAvatar">
            <img alt="Avatar"
                 :src="message.message.avatar">
            <v-icon v-if="!message.message.avatar && message.message.fromUser">send</v-icon>
          </v-avatar>
          <v-avatar class="d-flex" size="30" v-else-if="message.message.fromUser">
          </v-avatar>
          <span :class="borderClass">{{ message.message.text }}</span>
        </div>
      </v-col>
      <v-col v-if="message.message.fromUser" cols="3" class="pa-0 ma-0"></v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Prop, Component, Vue} from 'vue-property-decorator'
import {MessageView, MessageClass} from "@/data/message"
import dayjs from "dayjs"

@Component
export default class MessageBubble extends Vue {
  @Prop({required: true})
  readonly message!: MessageView

  get dateString(): string {
    if (this.message.date == null) {
      return ""
    }

    const date = dayjs(this.message.date)
    const twoDaysAgo = dayjs().add(-1, "day")
    if (date.isBefore(twoDaysAgo)) {
      return date.format("YYYY/MM/DD HH:mm")
    }
    return date.fromNow()
  }

  get showAvatar(): boolean {
    return this.message.message.fromUser &&
        (this.message.klass === MessageClass.FIRST || this.message.klass === MessageClass.ONLY)
  }

  get borderClass(): string {
    switch (this.message.klass) {
      case MessageClass.FIRST:
        return "first"
      case MessageClass.MIDDLE:
        return "middle"
      case MessageClass.LAST:
        return "last"
      case MessageClass.ONLY:
        return "only"
      default:
        return ""
    }
  }

  get bubbleClass(): string {
    const def = "message-bubble"
    return !this.message.message.fromUser ? def + ' sender' : def
  }
}
</script>

<style>
.message-bubble {
  font-family: "Helvetica Neue", "Segoe UI", "Helvetica", "Arial", "hiragino kaku gothic pro", "meiryo", "ms pgothic", "sans-serif";
  -webkit-font-smoothing: antialiased;
  border-top: 2px solid transparent;
}

.message-bubble span {
  background: #26272A;
  display: block;
  color: white;
  padding: 6px 16px;
  margin-left: 14px;
}

.message-bubble span.first {
  margin-top: 15px;
  border-radius: 1.3em 1.3em 1.3em 0;
}

.message-bubble span.middle {
  border-radius: 0 1.3em 1.3em 0;
}

.message-bubble span.last {
  border-radius: 0 1.3em 1.3em 1.3em;
}

.message-bubble span.only {
  border-radius: 1.3em;
}

.sender {
  float: right;
  clear: both;
}

.sender span {
  background: #1583F5;
  color: white;
  margin-left: 0;
  max-width: 100%;
}

.sender span.first {
  margin-top: 15px;
  border-radius: 1.3em 1.3em 0 1.3em;
}

.sender span.middle {
  border-radius: 1.3em 0 0 1.3em;
}

.sender span.last {
  border-radius: 1.3em 0 1.3em 1.3em;
}

.only-top {
  margin-top: 15px;
}

.sender span.only {
  border-radius: 1.3em;
}

.middle {
  border-radius: 0;
}

.last {
  border-radius: 0 0 1.3em 1.3em;
}

.date-time {
  text-align: center;
  clear: both;
  padding-top: 30px;
  padding-bottom: 10px;
  font-size: 14px
}

</style>
