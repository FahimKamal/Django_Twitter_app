const tweetsElement = document.getElementById('tweets')
tweetsElement.innerHTML = 'Loading...'
const xhr = new XMLHttpRequest()
const method = 'GET'
const url = "/tweets"
const responseType = "json"

xhr.responseType = responseType
xhr.open(method, url)
xhr.onload = function () {
  const serverResponse = xhr.response
  var listedItems = serverResponse.response
  console.log(listedItems)
}
xhr.send()