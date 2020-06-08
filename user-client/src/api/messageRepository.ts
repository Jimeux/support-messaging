import Message from "@/data/message";
import axios from "axios";
import {User, UserSummary} from "@/data/user";

export default class MessageRepository {
  public async fetchMessages(userId: number, page: number): Promise<Array<Message>> {
      const response = await axios.get(`http://localhost:3000/messages?userId=${userId}&_page=${page}&_limit=20&_sort=id&_order=desc`);
      return (response.data as Array<Message>);
  }

  public async fetchUserSummaries(): Promise<Array<UserSummary>> {
      const response = await axios.get(`http://localhost:3000/summaries`);
      return (response.data as Array<UserSummary>);
  }

  public async fetchUser(userId: number): Promise<User> {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      return (response.data as User);
  }
}
