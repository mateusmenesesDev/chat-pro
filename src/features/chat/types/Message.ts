export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  user: {
    name: string;
    avatar: string;
  };
};
