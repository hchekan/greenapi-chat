import axios from 'axios';
import { useUserStore } from '@store/user/user.store';
import type { MessageToSend } from '@/types/messages.types';

const api = (method: string, url: string, data?: any) => {

  const user = useUserStore.getState().user;

  const baseURL = `${user?.apiUrl}/waInstance${user?.id}/${url}/${user?.apiTokenInstance}`;

  return axios({
    method,
    data,
    baseURL,
  });
};

export default {
  sendMessageApi: (message: MessageToSend) => api('post', 'sendMessage', message)
};