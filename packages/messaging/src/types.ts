export interface MessagesMetadata {}
export interface PortsMetadata {}

export type MessageName = keyof MessagesMetadata
export type PortName = keyof PortsMetadata

export type InternalSignal = "__PLASMO_MESSAGING_PING__"

export namespace PlasmoMessaging {
  export type Request<TName = any, TBody = any> = {
    name: TName

    port?: chrome.runtime.Port
    sender?: chrome.runtime.MessageSender

    body?: TBody
    tabId?: number
    relayId?: string
  }

  export type InternalRequest = {
    __PLASMO_INTERNAL_SIGNAL__: InternalSignal
  }

  export type Response<TBody = any> = {
    send: (body: TBody) => void
  }

  export type InternalHandler = (request: InternalRequest) => void

  export type PortHandler<RequestBody = any, ResponseBody = any> = (
    request: Request<PortName, RequestBody>,
    response: Response<ResponseBody>
  ) => void | Promise<void> | boolean

  export type MessageHandler<RequestBody = any, ResponseBody = any> = (
    request: Request<MessageName, RequestBody>,
    response: Response<ResponseBody>
  ) => void | Promise<void> | boolean

  export interface SendFx<TName = MessageName> {
    <RequestBody = any, ResponseBody = any>(
      request: Request<TName, RequestBody>
    ): Promise<ResponseBody>
  }

  export interface RelayFx {
    <RelayName = any, RequestBody = any, ResponseBody = any>(
      request: Request<RelayName, RequestBody>,
      onMessage?: (
        request: Request<RelayName, RequestBody>
      ) => Promise<ResponseBody>
    ): () => void
  }

  export interface MessageRelayFx {
    <RequestBody = any>(request: Request<MessageName, RequestBody>): () => void
  }

  export type MessageHook = () => {
    send: SendFx
  }

  export interface PortHook {
    <TRequestBody = Record<string, any>, TResponseBody = any>(name: PortName): {
      data: TResponseBody
      send: (payload: TRequestBody) => void
    }
  }
}

export type OriginContext =
  | "background"
  | "extension-page"
  | "sandbox-page"
  | "content-script"
  | "window"
