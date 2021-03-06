import Message from "@/data/message"
import axios from "axios"

export default class MessageRepository {
  public async fetchMessages(userId: number, page: number): Promise<Array<Message>> {
    const response = await axios.get(`/api/v1/users/${userId}/messages?page=${page}&limit=20`)
    return response.data.messages.map((m: any) => new Message(m))
  }

  public async create(userId: number, content: string): Promise<Message> {
    const response = await axios.post(`/api/v1/messages/`, {
      user_id: userId,
      content,
    })
    return new Message(response.data)
  }
}
