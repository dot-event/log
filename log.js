/*prettier-ignore*/
"use strict";

var levelEmojis = {
  debug: "🐛",
  error: "🛑",
  info: "ℹ️",
  trace: "💻",
  warn: "⚠️",
}

var levelSpaces = {
  debug: "",
  error: "",
  info: " ",
  trace: "",
  warn: " ",
}

var levels = ["debug", "trace", "info", "warn", "error"]

module.exports = function log(dot, opts) {
  if (dot.state.log) {
    return
  }

  dot.state.log = Object.assign(
    {
      level: "info",
    },
    opts
  )

  dot.beforeAny(logAll)
  dot.any("log", logger)
}

function logAll(prop, arg, dot, event) {
  if (event === "log") {
    return
  }

  dot("log", arg.level, prop, {
    event: event,
    message: arg,
  })
}

function logger(prop, arg, dot, e) {
  var level = "info",
    state = dot.state.log

  if (levels.indexOf(prop[0]) > -1) {
    level = prop[0]
    prop = prop.slice(1)
  }

  if (levels.indexOf(level) < levels.indexOf(state.level)) {
    return
  }

  var custom = arg.event || arg.message
  var message = custom ? arg.message : arg
  var event = custom ? arg.event : e
  var space =
    typeof window === "undefined" ? levelSpaces[level] : ""

  var out = [
    new Date().toISOString(),
    levelEmojis[level] + space,
  ]

  if (event) {
    out.push("[" + event + "]")
  }

  if (prop.length) {
    out.push(prop.join("."))
  }

  if (message) {
    out.push(message)
  }

  // eslint-disable-next-line no-console
  console.log.apply(null, out)
}
