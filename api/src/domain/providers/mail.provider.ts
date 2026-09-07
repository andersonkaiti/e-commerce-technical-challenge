export interface ISendMailParams {
  to: string
  subject: string
  body: string
}

export interface IMailProvider {
  sendMail(params: ISendMailParams): Promise<void>
}
