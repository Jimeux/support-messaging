import Message from "@/data/message"
import axios from "axios"

export default class MessageRepository {
  public async fetchMessages(userId: number, page: number): Promise<Array<Message>> {
      const response = await axios.get(`/api/v1/messages?userId=${userId}&_page=${page}&_limit=20&_sort=id&_order=desc`)
      return (response.data as Array<Message>)
  }
}
