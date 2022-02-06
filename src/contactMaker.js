function makeContactDiv(contact){
  let contactDiv = document.createElement("div");
}

function fillContactDiv(contact,contactDiv){
  // setting contact attributes
  contact.setAttribute("class","contact");
  contact.setAttribute("id",contact.ID);
  // adding the name part
  let contactName = document.createElement("div");
  contactName.setAttribute("class","contactNameText");
  contactName.innerHTML = contact.firstName +" "+contact.lastName;
  // add the button
  let extendButton = document.createElement("button");
  extendButton.setAttribute("class","contactExtendButton");
  extendButton.setAttribute("contactID",contact.ID);
  // here we would add the event listener
  contact.appendChild(contactName);
}

function getContactInfo(contact){
  let email = contact.email;
  let phoneNum = contact.phoneNum;
  let contactInfoDiv = document.createElement("div");
  contactInfoDiv.innerHTML = email + "  "+ phoneNum;
  return contactInfoDiv;
}

function myCallback(status, data) {
    console.log(data);
}

function postJSONSearch(url, json_data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(json_data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            myCallback(null, xhr.response);
        } else {
            myCallback(status, xhr.response);
        }
    }
}

let demoRequest = {"userId":"55","search",""};
postJSONSearch("https://cop4331.acobble.io/Search.php",demoRequest);
