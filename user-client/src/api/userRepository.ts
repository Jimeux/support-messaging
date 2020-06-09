import axios from "axios";
import {User, UserSummary} from "@/data/user";

export default class UserRepository {
  public async fetchUserSummaries(): Promise<Array<UserSummary>> {
      const response = await axios.get(`http://localhost:3000/summaries`);
      return (response.data as Array<UserSummary>);
  }

  public async fetchUser(userId: number): Promise<User> {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      return (response.data as User);
  }
}
