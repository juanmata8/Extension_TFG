
  async function postData(url = "", data = {}) {
    try{
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      // console.log("body response: ", response.body);
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      const responseData = await response.json(); // Parse the JSON data
    
      console.log("post response: ", responseData);
      return responseData;
    }catch(e){
      console.error(e)
    }
    // console.log("data: ", data);
    
  }
  
  
  const post_endpoint = 'http://localhost:5000/process_html';
  let source_result = ""
  

  
  let article_result = ""
  let title_result = ""
  
  const process_result = (data) => {
    try{
      // console.log(data);
    const t = data.title_classification;
    console.log('title: ', t)
    const a = data.article_classification;
    console.log('article: ', a)
    const s = data.sources;
    
    console.log('sources: ', s)
    const s_array = s.split(",");
    console.log('arrays: ', s_array)
    let title_newElement = document.createElement('div');
    let article_newElement = document.createElement('div');
    let sources_newElement = document.createElement('div');
    if(t){
      if (t == "CLICKBAIT") {
        title_result = "El analisis del titulo determina que es clickbait";
        title_newElement.innerHTML = '<div class="red-shape"></div>';
        document.getElementById("title-container").appendChild(title_newElement);
      }else if (t == "NO CLICKBAIT"){
        title_result = "El analisis del titulo determina que no es clickbait";
        title_newElement.innerHTML = '<div class="green-shape"></div>';
        document.getElementById("title-container").appendChild(title_newElement);
      }else{
        title_result = "El analisis del titulo no ha podido determinar si es clickbait o no";
        document.getElementById("title-container").appendChild(title_newElement);
      }
      document.getElementById("title_analysis").innerHTML = `<li class="message-text">${title_result}</li>`;
        console.log(title_result); 
    }else console.log("no title analysis found")
    if(a){
      if (a == "FAKE NEW") {
        article_result = "El analisis del articulo determina que la noticia es falsa";
        article_newElement.innerHTML = '<div class="red-shape"></div>';
        document.getElementById("article-container").appendChild(article_newElement);
        
      }else if (a == "TRUE NEW"){
        article_result = "El analisis del articulo determina que la noticia es real";
        article_newElement.innerHTML = '<div class="green-shape"></div>'
        document.getElementById("article-container").appendChild(article_newElement);
      }else{
        article_result = "El analisis del articulo no ha podido determinar si la noticia es falsa o real";
        // article_newElement.innerHTML = '<div class="yellow-shape"></div>'
        document.getElementById("article-container").appendChild(article_newElement);
      }
      document.getElementById("article_analysis").innerHTML = `<li class="message-text">${article_result}</li>`;
      console.log(article_result);
    }else console.log("no article analysis found")  
    
    if(s.length > 0) {
      source_result = "El analisis de fuentes ha encontrado otras fuentes que han reportado esta noticia";
      sources_newElement.innerHTML = '<div class="green-shape"></div>'
      document.getElementById("sources-container").appendChild(sources_newElement);
      document.getElementById("list_of_sources").innerHTML = s_array.map(m =>`<li class="message-text">${m}</li>`);
    }else{
      source_result = "El analisis de fuentes no ha encontrado otras fuentes que hayan reportado esta noticia";
      sources_newElement.innerHTML = '<div class="red-shape"></div>'
      document.getElementById("sources-container").appendChild(sources_newElement);
      console.log(source_result);
      
    }
    document.getElementById("source_analysis").innerHTML = `<li class="message-text">${source_result}</li>`;
    
      
    
    
    }catch(e){
      console.error(e)
    }
   
  
  }
  console.log("popup.js loaded")
  document.addEventListener('DOMContentLoaded', function () {
    // Request the html from the background script
    chrome.runtime.sendMessage({action: 'getHtml'}, (response) => {
        if (response && response.html) {
            
            console.log('Received html:', response.html);
            const data_value = { html: `${response.html}` }; // data to be sent to the server
  postData(post_endpoint, data_value)
    .then(data => {

      process_result(data);
      console.log(data); // Handle the response data here
    })
    .catch(error => {
      console.error(error); // Handle any errors that occur during the API call
    });
        }
    });
});
