const tweetsEl = document.getElementById('tweets')

function loadTweets(tweetsElement) {
  const xhr = new XMLHttpRequest()
  const method = 'GET'
  const url = "/tweets"
  const responseType = "json"

  xhr.responseType = responseType
  xhr.open(method, url )
  xhr.onload = function () {
    const serverResponse = xhr.response
    var listedItems = serverResponse.response
    var finalTweetStr = ""
    var i;
    for (i = 0; i < listedItems.length; i++){
      // console.log(i);
      // console.log(listedItems[i]);
      var tweetobject = listedItems[i]
      var currentItem = formatTweetElement(tweetobject)
      finalTweetStr += currentItem
    }
    tweetsElement.innerHTML = finalTweetStr
    // console.log(listedItems)
  }
  xhr.send()
}

loadTweets(tweetsEl)

function handleDidLike (tweet_id, currentCount){
  console.log(tweet_id, currentCount);
}

function LikeBtn(tweet){
  return "<button class='btn btn-primary btn-small' onclick=handleDidLike(" + tweet.id+","+ tweet.likes+ ")>" + tweet.likes +" Likes</button>"
}

function formatTweetElement(tweet){
  var formattedTweet = "<div class='col-12 col-md-10 mx-auto border rounded py-3 mb-4 tweet' id='tweet-"+ tweet.id +"'>" +
    "<p>" + tweet.content +"</p>"+
    "<div class='btn-group'>" + LikeBtn(tweet) + "</div>"+
  "</div>"
  return formattedTweet
}

const tweetsCreateFromEl = document.getElementById("tweet-create-form")
tweetsCreateFromEl.addEventListener("submit", handleTweetCreateFormDidSubmit)

function handleTweetCreateFormDidSubmit(event){
  event.preventDefault()
  const myForm = event.target
  const myFormData = new FormData(myForm)
  console.log(myFormData);
  const url = myForm.getAttribute('action')
  const method = myForm.getAttribute('method')
  const xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhr.onload = function () {
    const newTweet = xhr.response
    console.log(xhr.status, serverResponse)
    const tweetsEl = document.getElementById('tweets')
    formatTweetElement(newTweet)
  }
  xhr.send(myFormData)
}
