/* eslint-disable no-console */
import { register } from "register-service-worker"

register(`/firebase-messaging-sw.js`, {
  ready() {}
})
