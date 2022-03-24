const moreButton = `<div class="moreButton">
<button onclick="morePosts()" id="moreButton" class="w3-button w3-white w3-border">More posts</button>
</div>`;
// scroll To bottom
document.getElementById('about').addEventListener('click', () => {
  window.scrollTo({
    top: document.getElementById('newsSection').clientHeight,
    behavior: 'smooth'
  })
});
// scroll To top
document.getElementById('arrow').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
});
// w3 code
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");
// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");
// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}
// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

let element = ``;
// starts the app
const startApp = async function(category, country) {
  document.getElementById('newsSection').innerHTML = 
    `<div class="w3-row w3-center w3-padding-64-top" style="height:100vh;">
      <p class="w3-row w3-center w3-padding-64-top"><i class="fa fa-spinner w3-spin" style="font-size:64px"></i></p>
    </div>`
  
  await fetchNews(category, country);

  updatePage();
}

// updates page
const updatePage = function() {
  if (newsObj.status != "ok" || newsObj.totalResults == 0) {
    document.getElementById('newsSection').innerHTML = 
      `<div class="w3-row w3-center w3-padding-64-top" style="height:67vh;">
      <p class="w3-row w3-center w3-padding-64-top" style="font-size:26px;">Seems like there are no news!</p>
      </div>`
  } else if (newsObj.status === "ok") {
        if (newsObj.totalResults < 3){
          document.querySelector('footer').style.marginTop = '300px';
        }
        for (let i in newsObj.articles) {
          let newElement;
          newElement = `<!-- Post -->
            <div id="post" class="w3-row w3-padding-64-top" style="display:${i>9?'none':'block'}">
              <div class="w3-third w3-container">
                <p class="w3-center"><img ${i>4?'loading="lazy"':''} src="${newsObj.articles[i].urlToImage?newsObj.articles[i].urlToImage:'./noimage.jpg'}" class="w3-round" alt="${newsObj.articles[i].title}"></p>
              </div>
              <div class="w3-twothird w3-container">
                <h2 class="w3-text-teal" style="margin-bottom:0;">${newsObj.articles[i].title?newsObj.articles[i].title:'Not provided'}</h2>
                <h6 style="margin-top:0;opacity:0.7;">By: ${newsObj.articles[i].author?newsObj.articles[i].author:'Not provided'} on ${newsObj.articles[i].publishedAt}</h6>
                <h5>${newsObj.articles[i].description?newsObj.articles[i].description:'No description.'}</h5>
                <p><b>Article: </b>${newsObj.articles[i].content? newsObj.articles[i].content: 'No content provided! Head to the site to see if they have the news.'} <small><a href="${newsObj.articles[i].url}" target="_blank">Read more on ${newsObj.articles[i].source['name']}</a></small></p>
              </div>
            </div>
            <!-- Break Line -->
            <div class="w3-display-container">
              <div class="w3-display-middle">
                <hr>
              </div>
            </div>`
            element += newElement;
        }
        element += moreButton;
        document.getElementById('newsSection').innerHTML = element;
        window.scrollTo({
          top: -document.getElementById('newsSection').clientHeight,
          behavior: 'smooth'
        });
      }
      element = ``;
}

// for more posts button
const morePosts = function() {
  let posts = document.querySelectorAll('#post');
  for (item of posts) {
    if (item.style.display == 'none') {
      item.style.display = 'block';
    }
  }
  document.getElementById('moreButton').style.display = 'none';
}


// fetches the top headlines
var newsObj;
const fetchNews = async function(category, country) {
  return fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=ed11b25f68254b7ba8f569b08791625b&pageSize=20&category=${category}`)
    .then((response) => {
      if (response.ok){
        return response.json();
      } else {
        return response;
      }
    })
    .then((response) => {
      newsObj = response;
    })
}

const fetchSearch = async function(apiKey) {
  return fetch(apiKey)
    .then((response) => {
      if (response.ok){
        return response.json();
      } else {
        return response;
      }
    })
    .then((response) => {
      newsObj = response;
    })
}

const searchNews = async function(event) {
  event.preventDefault();
  console.log(event)
  let query = event.path[0][0].value;
  if (query == ''){
    // code
    return;
  }
  let language = event.path[0][1].value; // 1:english / 2:spanish
  if (language == '1'){
    language = 'en';
  } else if (language == '2'){
    language = 'es';
  }
  let sort = event.path[0][2].value; // 1:relevant / 2:time
  if (sort == '1'){
    sort = 'relevancy';
  } else if (sort == '2'){
    language = 'publishedAt';
  }
  let dateFrom = event.path[0][3].value;
  let dateTo = event.path[0][4].value;
  apiKey = `https://newsapi.org/v2/everything?apiKey=ed11b25f68254b7ba8f569b08791625b&pageSize=20&q=${query}&language=${language}&sortBy=${sort}&from=${dateFrom}&to=${dateTo}`

  await fetchSearch(apiKey);

  updatePage();
}