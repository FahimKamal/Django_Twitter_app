function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const tweetContainerElement = document.getElementById('tweets')

function loadTweets(tweetsElement) {
  /*
    This function will receive the tweets objects from
    backend and put them on page.
  */
  console.log('Im working')
  const xhr = new XMLHttpRequest()
  const method = 'GET'
  const url = "/tweets/"
  xhr.responseType = 'json'
  xhr.open(method, url )
  xhr.onload = function () {
    const serverResponse = xhr.response
    var listedItems = serverResponse
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

loadTweets(tweetContainerElement)

function handleTweetActionBtn (tweet_id, currentCount, action){
  // console.log(tweet_id, currentCount);
  const url = "api/tweets/action/"
  const method = "POST"
  const data = JSON.stringify({
    id: tweet_id,
    action: action
  })
  const xhr = new XMLHttpRequest()

  const csrftoken = getCookie('csrftoken');
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhr.setRequestHeader("X-CSRFToken", csrftoken)

  xhr.onload = function (){
    loadTweets(tweetContainerElement)
  }
  xhr.send(data)
}

function ReTweetBtn(tweet){
  /*
  This function will return the like button
  with number of likes in the button.
  */
  return "<button class='btn btn-outline-success btn-small' onclick=handleTweetActionBtn("
  + tweet.id+","+ tweet.likes+ ",'retweet')>Retweet</button>"
}

function UnLikeBtn(tweet){
  /*
  This function will return the like button
  with number of likes in the button.
  */
  return "<button class='btn btn-outline-primary btn-small' onclick=handleTweetActionBtn("
  + tweet.id+","+ tweet.likes+ ",'unlike')>Unlike</button>"
}

function LikeBtn(tweet){
  /*
  This function will return the like button
  with number of likes in the button.
  */
  return "<button class='btn btn-primary btn-small' onclick=handleTweetActionBtn("
  + tweet.id+","+ tweet.likes+ ",'like')>" + tweet.likes +" Likes</button>"
}

function formatTweetElement(tweet){
  /*
    Returns the tweets in html format to show in frontend.
  */
  var formattedTweet =""+
  "<div class='col-12 col-md-10 mx-auto border rounded py-3 mb-4 tweet' id='tweet-"+ tweet.id +"'>" +
    "<p>" + tweet.content +"</p>"+
    "<div class='btn-group'>"
    + LikeBtn(tweet)
    + UnLikeBtn(tweet)
    + ReTweetBtn(tweet)
    + "</div>"+
  "</div>"
  return formattedTweet
}

const tweetsCreateFromEl = document.getElementById("tweet-create-form")
tweetsCreateFromEl.addEventListener("submit", handleTweetCreateFormDidSubmit)

function handleTweetCreateFormDidSubmit(event){
  /*
    This function runs when submit button is prssed.
    send the data to backend to save in database.
  */
  event.preventDefault()
  const myForm = event.target
  const myFormData = new FormData(myForm)
  const url = myForm.getAttribute('action')
  const method = myForm.getAttribute('method')
  const xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  xhr.responseType = "json"
  xhr.onload = function () {
    if (xhr.status === 201) {
      handleTweetFormError("", false)
      const newTweet = xhr.response
      const newTweetElement = formatTweetElement(newTweet)

      //  add new tweet to the first of list of existing list of tweets

      const ogHtml = tweetContainerElement.innerHTML
      tweetContainerElement.innerHTML = newTweetElement + ogHtml
      myForm.reset()
    } else if (xhr.status === 400) { // Server not running
      const errorJson = xhr.response
      const contentError = errorJson.content
      console.log(errorJson);
      let contentErrorMsg;
      if (contentError) {
        contentErrorMsg = contentError[0]
        if (contentErrorMsg) {
          handleTweetFormError(contentErrorMsg, true)
        } else {
          alert("An error occured. Please try again.")
        }
      } else {
        alert("An error occured. Please try again.")
      }
      console.log(contentErrorMsg);

    } else if (xhr.status === 401) {
      alert("You must login!")
      window.location.href = "/login/"
    } else if (xhr.status === 403) {
      alert("You must login!")
      window.location.href = "/login/"
    } else if (xhr.status === 500) { // server error code
      alert("There was a server error, please try again.")
    }

  }
  xhr.onerror = function() {
    alert("An error occurred. Please try again later.")
  }
  xhr.send(myFormData)
}

function handleTweetFormError(msg, display) {
  // This function is executed when a error is occoured.
  var myErrorDiv = document.getElementById("tweet-create-form-error")
  if (display === true) {
    // show error
    myErrorDiv.setAttribute("class", "d-block alert alert-danger")
    myErrorDiv.innerText = msg
  } else {
    // Hibe error
    myErrorDiv.setAttribute("class", "d-none alert alert-danger")
  }
}
/*
6amj7zbk
dqgkkavo
fzxmvjpm
jwaw3wi6
apjygqxw
up4anzz7
t7gieika
6dzwgon2
mjshdkrr
pbuy6ds4
*/
