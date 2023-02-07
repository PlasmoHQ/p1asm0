import { relay as rawRelay, sendViaRelay as rawSendViaRelay } from "./relay"
import type { PlasmoMessaging } from "./types"
import { getActiveTab } from "./utils"

export type {
  PlasmoMessaging,
  MessageName,
  PortName,
  PortsMetadata,
  MessagesMetadata,
  OriginContext
} from "./types"

/**
 * Should only be called from CS or Ext Pages
 * TODO: Add a framework runtime check, using a global varaible
 */
export const sendToBackground: PlasmoMessaging.SendFx = (req) =>
  new Promise((resolve, reject) => {
    if (!chrome?.runtime) {
      throw new Error("chrome.runtime is not available")
    }
    chrome.runtime.sendMessage(req, (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(res)
      }
    })
  })

/**
 * Send to CS from Ext Pages
 */
export const sendToActiveContentScript: PlasmoMessaging.SendFx = (req) =>
  new Promise(async (resolve, reject) => {
    if (!chrome?.tabs) {
      throw new Error("chrome.tabs is not available")
    }
    const tabId =
      typeof req.tabId === "number" ? req.tabId : (await getActiveTab()).id

    chrome.tabs.sendMessage(tabId, req, (res) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(res)
      }
    })
  })

/**
 * Any request sent to this relay get send to background, then emitted back as a response
 */
export const relayMessage: PlasmoMessaging.MessageRelayFx = (req) =>
  rawRelay(req, sendToBackground)

/**
 * @deprecated use `relayMessage` instead
 */
export const relay = relayMessage

/**
 * @deprecated use `sendViaRelay` from "@plasmohq/messaging/relay"
 */
export const sendViaRelay = rawSendViaRelay
