const container=document.querySelector(".container");
const promptForm = document.querySelector(".prompt-form");
const promptInput=promptForm.querySelector(".prompt-input");
const chatsContainer=document.querySelector(".chats-container");
const fileInput=promptForm.querySelector("#file-input");
const fileUploadWrapper=promptForm.querySelector(".file-upload-wrapper");
const themeToggle=document.querySelector("#theme-toggle-btn");




//API setup
const API_KEY="AIzaSyCEwd2ud1FNsUgZWJddiQjCb5MAlt8IAjs";
const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}` ;



//Handle th form submission
//let userMessage="";
let typingInterval, controller;
const chatHistory=[];
const userData={ message: "", file: {}};

//function to create message elment
const createMsgElement=(content, ...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML=content;
    return div;
}

const scrollToBottom =() => container.scrollTo({ top: container.scrollHeight, behavior:"smooth"});


//simulate typing effct for both response
const typingEffect=(text,textElement,botMsgDiv)=>{
    textElement.textContent = "";
    const words=text.split(" ");
    let wordIndex=0;
//set an interval to type each word

    typingInterval=setInterval(()=>{
        if(wordIndex < words.length){
            textElement.textContent +=(wordIndex === 0 ? "" : " ") + words[wordIndex++];
            //botMsgDiv.classList.remove("loading");

            scrollToBottom();
        }else{
            clearInterval(typingInterval);
            botMsgDiv.classList.remove("loading");
            document.body.classList.remove("bot-responding");



        }
    },40);

    
}

const generateResponse =async(botMsgDiv)=>{
    const textElement=botMsgDiv.querySelector(".message-text");
    controller=new AbortController();

    chatHistory.push({
        role:"user",
        //parts:[{ text: userMessage}]
        parts:[{text :userData.message}, ...(userData.file.data ? [{ inline_data : (({ fileName, isImage, ...
        rest}) => rest)(userData.file) }]:[])]
    });


    try{
        const response= await fetch(API_URL,{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({contents:chatHistory}),
            signal: controller.signal
        });

        const data=await response.json();
        if(!response.ok) throw new Error(data.error.message);
        const responseText=data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
        typingEffect(responseText, textElement, botMsgDiv);
        //textElement.textContent=responseText;

        chatHistory.push({
            role:"model",
            //parts:[{ text: userMessage}]
            parts:[{text :responseText}]
        });

       // console.log(chatHistory);

    } catch (error){

        //console.log(error);
      textElement.style.color = "#d62939";
      textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");


    }finally{
        userData.file ={};
    }
    
    

}

const handleFormSubmit =(e)=>{
    e.preventDefault();
const userMessage=promptInput.value.trim();
    if(!userMessage || document.body.classList.contains("bot-responding")) return;



    promptInput.value="";
    userData.message=userMessage;
    document.body.classList.add("bot-responding","chats-active");
    fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");


   // console.log(userMessage);
   const userMsgHTML=`
   <p class="message-text"></p>
   ${userData.file.data ? (userData.file.isImage ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}"
    class="img-attachment" />` : `<p class="file-attachment"><i class="fa-solid fa-file"></i>${userData.file.fileName}</p>`):""}

   
   `;
   const userMsgDiv=createMsgElement(userMsgHTML,"user-message");
   
   userMsgDiv.querySelector(".message-text").textContent=userMessage;
   chatsContainer.appendChild(userMsgDiv);
   scrollToBottom();

   setTimeout(() => {

     const botMsgHTML=`<img src="b.png" class="avatar"><p class="message-text">Just a sec...</p>`;
     const botMsgDiv=createMsgElement(botMsgHTML,"bot-message","loading");

     chatsContainer.appendChild(botMsgDiv);
     scrollToBottom();
     generateResponse(botMsgDiv);
    },600);

   
   

}

//Handle file input change(file upload)
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if(!file) return;
   // console.log(file);
   const isImage = file.type.startsWith("image/");
   const reader = new FileReader();
   reader.readAsDataURL(file);

   reader.onload = (e) => {
    fileInput.value = "";
    const base64String = e.target.result.split(",")[1];
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result;

    fileUploadWrapper.classList.add("active", isImage ? "img-attached" : "file-attached");

    //store file data in userData obj
    userData.file= { fileName: file.name, data:base64String, mime_type: file.type, isImage};


    
   }
});

//Cancle file upload
document.querySelector("#cancel-file-btn").addEventListener("click", () => {
    userData.file={};
    fileUploadWrapper.classList.remove("active", "img-attached", "file-attached");
});

//Stop button response.
document.querySelector("#stop-response-btn").addEventListener("click", () => {
    userData.file={};
    controller?.abort();
    clearInterval(typingInterval);
    chatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
    document.body.classList.remove("bot-responding");
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
    chatHistory.length=0;
    chatsContainer.innerHTML="";
    document.body.classList.remove("bot-responding","chats-active");

});

//Handle suggestions click
document.querySelectorAll(".suggestions-item").forEach(item => {
    item.addEventListener("click", () => {
        promptInput.value = item.querySelector(".text").textContent;
        promptForm.dispatchEvent(new Event("submit"));

    });
    
    
});

document.addEventListener("click",({ target }) => {
    const wrapper = document.querySelector(".prompt-wrapper");
    const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains
    ("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn")
    );
    wrapper.classList.toggle("hide-controls", shouldHide);
});

themeToggle.addEventListener("click", () =>{
  const isLightTheme = document.body.classList.toggle("light-theme");

});

promptForm.addEventListener("submit",handleFormSubmit);
promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());
