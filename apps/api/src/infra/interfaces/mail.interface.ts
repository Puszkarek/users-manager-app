type IAddress = {
  readonly email: string;
  readonly name: string;
};

export type IMessage = {
  readonly to: IAddress;
  readonly from: IAddress;
  readonly subject: string;
  readonly body: string;
};

export type IMailProvider = {
  readonly sendMail: (message: IMessage) => Promise<void>;
};
