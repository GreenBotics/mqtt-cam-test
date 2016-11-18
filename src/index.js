var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://10.106.241.170')
var fs = require('fs')

function padLeft (positiveInteger, totalDigits) {
  var padding = '00000000000000'
  var rounding = 1.000000000001
  var currentDigits = positiveInteger > 0 ? 1 + Math.floor(rounding * (Math.log(positiveInteger) / Math.LN10)) : 1
  return (padding + positiveInteger).substr(padding.length - (totalDigits - currentDigits))
}

// get fileName with highest number
const localFiles = fs.readdirSync('.')
  .sort()
  .filter(x => x.indexOf('capture-') > -1)
const lastFileId = localFiles.length > 0 ? parseInt(localFiles[localFiles.length - 1].replace('capture-', ''), 10) + 1 : 0
// console.log('localFiles', localFiles, lastFileId)

client.on('connect', function () {
  client.subscribe('/sensors/pic/0')
})

let counter = lastFileId
client.on('message', function (topic, message) {
  // message is Buffer
  console.log('topic', topic)
  if (topic === '/sensors/pic/0') {
    console.log(message)
    let fileName = `capture-${padLeft(counter, 10)}.jpg`
    fs.writeFile(fileName, message, (err) => {
      if (err) throw err
      console.log("It's saved!")
    })
    // fs.write(fd, buffer, offset, length[, position], callback)

    counter += 1
  }

// console.log(message.toString())
// client.end()
})
