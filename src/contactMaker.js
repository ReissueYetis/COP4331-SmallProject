let currentContact = 0;
const CONTACTS_PER_PAGE = 10;
let currentResults;
let userID

function makeContactDiv(contact,number){
  let contactDiv = document.createElement("div");
  appendContactChildren(contact,contactDiv,number);

  return contactDiv
}
function applyHidden(div) {
  div.setAttribute("class",div.getAttribute("class")+ " hidden");

}
function makeContactInfoDiv(divClass,email,phone){
  let ci = document.createElement("div");
  ci.setAttribute("class","row "+divClass);
  let emailDiv = document.createElement("div");
  emailDiv.setAttribute("class","col contactInfoText");
  emailDiv.innerHTML = email;
  let phoneDiv= document.createElement("div");
  phoneDiv.setAttribute("class","col contactInfoText");
  phoneDiv.innerHTML = phone;
  ci.appendChild(emailDiv);
  ci.appendChild(phoneDiv);
  return ci;
}

function deleteContact(id){
  let markedContact = document.getElementById(id);
  if(window.confirm("Are you sure you want to delete this contact?")){
    let data = markedContact.ID
    markedContact.remove();
    //ADD API CALL HERE
    postHandler(data, myCallback, API.delCon)
  }

}

function editContact(id){

}
// this takes the div class attribute as well as  the inner content
function makeEditAndDeleteButtonDiv(contactID){
  let newRow = document.createElement("div");
  newRow.setAttribute("class","row editButtons");
  newRow.setAttribute("contactID",contactID);
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  editButton.setAttribute("class","col text-right editContactButton");
  deleteButton.setAttribute("class","col removeContactButton");
  deleteButton.addEventListener("click",function(){ deleteContact(contactID) });
  editButton.innerHTML = "Edit Contact";
  deleteButton.innerHTML = "Remove Contact";
  newRow.appendChild(editButton);
  newRow.appendChild(deleteButton);
  return newRow;



}
function appendContactChildren(contact,contactDiv,number){
  // here is where we make all the subdivs for the contact
  // Below is for the name title
  let contactName = document.createElement("div");
  contactName.setAttribute("class","contactNameText col");
  contactName.innerHTML = contact.FirstName +" "+contact.LastName;
  // the extend button
  let extendButton = document.createElement("button");
  extendButton.setAttribute("class","contactExtendButton col-2");
  extendButton.setAttribute("contactID",contact.ID);
  extendButton.innerHTML = "&#8681;";
  extendButton.addEventListener("click", function(){changeInfoState(number)});
  // the ones below only come up whem the extend button is pressed
  let additionalInfo = document.createElement("div");
  additionalInfo.setAttribute("class","additionalInfo");
  additionalInfo.appendChild(makeContactInfoDiv("additionalInfoHeaders","Email","Phone"))
  additionalInfo.appendChild(makeContactInfoDiv("additionalInfoContent",contact.EmailAddress,contact.PhoneNumber));
  // now we append the children
  let editButtons = makeEditAndDeleteButtonDiv(number);
  contactDiv.appendChild(contactName);
  contactDiv.appendChild(extendButton);
  applyHidden(additionalInfo);
  applyHidden(editButtons);
  contactDiv.appendChild(additionalInfo);
  contactDiv.appendChild(editButtons);
}
// loads contacts in range
function loadContacts(contacts,lower,upper){
  // first we have to remove any contacts from previous loads
  console.log("loadContact's range is from "  +lower +"to"+ upper);
  let contactsDiv = document.querySelector("#contacts");
  contactsDiv.innerHTML ="";
  // now we iterate through the contacts, making a div for each
  // we must make sure that the amount of contacts is within range
  if(upper <= contacts.length){

    for(let i = lower; i<upper;i++)
    {
      let newContact = makeContactDiv(contacts[i],contacts[i].ID);
      newContact.setAttribute("id",contacts[i].ID);
      newContact.setAttribute("class","row contact");
      newContact.setAttribute("infoHidden","true");
      contactsDiv.appendChild(newContact);
    }
  }
  else if (upper > contacts.length && lower<=contacts.length){

    for(let i = lower; i<contacts.length;i++)
    {
      let newContact = makeContactDiv(contacts[i],contacts[i].ID);
      newContact.setAttribute("id",contacts[i].ID);
      newContact.setAttribute("class","row contact");
      newContact.setAttribute("infoHidden","true");
      contactsDiv.appendChild(newContact);
    }
  }
}


function getContactInfo(contact){
  let email = contact.email;
  let phoneNum = contact.phoneNumber;
  let contactInfoDiv = document.createElement("div");
  contactInfoDiv.innerHTML = email + "  "+ phoneNum;
  return contactInfoDiv;
}


// this function changes state of info from hidden to showing or vis-versa
function changeInfoState(contactNum){
  let contact = document.getElementById(contactNum);
  let info = contact.querySelector(".additionalInfo");
  let editButtons = contact.querySelector(".editButtons");
  // if the div is hidden
  if(contact.getAttribute("infoHidden")=="true")
  {
    info.setAttribute("class","additionalInfo");
    contact.setAttribute("infoHidden","false");
    editButtons.setAttribute("class","row editButtons")


  }
  else{
    applyHidden(info);
    applyHidden(editButtons)
    contact.setAttribute("infoHidden","true");
  }
}
function getNextPage(){

  // only load next page if there is one
  if(currentContact < currentResults.length){
    // if loading the next amount of contacts will go over the length
    // just go up to length
    if(currentContact + (CONTACTS_PER_PAGE) > currentResults.length){
      loadContacts(currentResults,currentContact,currentResults.length);
      currentContact = currentResults.length;
    }
    else{
      loadContacts(currentResults,currentContact,currentContact+(CONTACTS_PER_PAGE*2));
      currentContact+=CONTACTS_PER_PAGE;
    }
  }
}

function getPrevPage(){
  console.log("CURRENT CONTACT IS AT "+ currentContact);
  // Only get prev page if current page is above the
  if(currentContact > 0 && currentContact-(CONTACTS_PER_PAGE*2) >= 0){
    // if there are less contacts to be loaded than the amount per page
    // just go to the last one that can be loaded
    if(currentContact-(CONTACTS_PER_PAGE*2) >= 0){
      loadContacts(currentResults,currentContact-(CONTACTS_PER_PAGE*2),currentContact-CONTACTS_PER_PAGE);
      currentContact -= CONTACTS_PER_PAGE;
    }
    else{
      console.log("THIS IS THE OTHER ELSE");
      loadContacts(JSONResults.results,currentContact-currentContact,currentContact);
      currentContact-=currentContact;
    }
  }
}

function addPageButtonListeners(){
  let prevButton = document.querySelector("#prevButton");
  let nextButton = document.querySelector("#nextButton");
  prevButton.addEventListener("click",function(){getPrevPage()});
  nextButton.addEventListener("click",function(){getNextPage()});


}
/*
function addSearchBarEL(){
  let searchBar = document.querySelector("searchBar");
  // on every change to the search bar there will be a search executed
  searchBar.addEventListener("input",function(){searchAndUpdate(userID)});

}
*/
function searchAndUpdate(id){
  // first get search bar contents


}

function searchCB(response, textStatus, xhr){
  if (textStatus !== "error") {
    if (response.error === "") {
      updatePageState(response.results)
      loadContacts(currentResults,0,CONTACTS_PER_PAGE);
      currentContact = CONTACTS_PER_PAGE;
    } else {
      // TODO: no contacts found error message
    }
  } else {
    // TODO: please try again error msg
    updatePageState(JSONResults.results)
    loadContacts(JSONResults.results, 0, CONTACTS_PER_PAGE)
    // console.log(JSONResults)
  }
}
// this will get the ID of the current user with a cookie as well as call the empty search
// which will fill the page
function loadInitialPageState(){
  userID = readCookie("id");
  console.log(userID);
}
function updatePageState(results){
  currentResults = results;
}

// addSearchBarEL()
// postHandler({userId:userID, search:""},searchCB,API.searchCon);
addPageButtonListeners();

let JSONResults = {
  "results": [
    {
      "ID": 44,
      "FirstName": "Mary",
      "LastName": "Salazar",
      "PhoneNumber": "206-794-7703",
      "EmailAddress": "MaryTSalazar@cuvox.de",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 45,
      "FirstName": "Taylor",
      "LastName": "Arnold",
      "PhoneNumber": "928-289-6377",
      "EmailAddress": "TaylorArnold@jourrapide.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 46,
      "FirstName": "Brooke",
      "LastName": "Price",
      "PhoneNumber": "812-418-0834",
      "EmailAddress": "BrookePrice@armyspy.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 47,
      "FirstName": "Ellis",
      "LastName": "Talbot",
      "PhoneNumber": "504-313-8784",
      "EmailAddress": "EllisTalbot@fleckens.hu",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 48,
      "FirstName": "Katherine",
      "LastName": "Walters",
      "PhoneNumber": "614-716-5222",
      "EmailAddress": "KatherineWalters@teleworm.us",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 49,
      "FirstName": "Constanza",
      "LastName": "Anguiano",
      "PhoneNumber": "817-976-6172",
      "EmailAddress": "ConstanzaAnguianoMojica@jourrapide.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 50,
      "FirstName": "Elliot",
      "LastName": "Faulkner",
      "PhoneNumber": "770-571-9300",
      "EmailAddress": "ElliotFaulkner@jourrapide.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 51,
      "FirstName": "Betty",
      "LastName": "Call",
      "PhoneNumber": "936-679-8397",
      "EmailAddress": "BettyJCall@einrot.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 52,
      "FirstName": "Adam",
      "LastName": "Chacón",
      "PhoneNumber": "609-906-9791",
      "EmailAddress": "AdamChaconChapa@einrot.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 53,
      "FirstName": "John",
      "LastName": "Bartee",
      "PhoneNumber": "631-269-0057",
      "EmailAddress": "JohnCBartee@teleworm.us",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 54,
      "FirstName": "Rosie",
      "LastName": "Godfrey",
      "PhoneNumber": "301-740-5717",
      "EmailAddress": "RosieGodfrey@superrito.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 55,
      "FirstName": "Matthew",
      "LastName": "Hines",
      "PhoneNumber": "618-644-4289",
      "EmailAddress": "MatthewAHines@superrito.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 56,
      "FirstName": "Victoria",
      "LastName": "Watson",
      "PhoneNumber": "614-993-8075",
      "EmailAddress": "VictoriaJWatson@gustr.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 57,
      "FirstName": "Carlos",
      "LastName": "Lebeau",
      "PhoneNumber": "417-955-8587",
      "EmailAddress": "CarlosPLebeau@dayrep.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 58,
      "FirstName": "Imogen",
      "LastName": "Wheeler",
      "PhoneNumber": "757-486-2389",
      "EmailAddress": "ImogenWheeler@einrot.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 59,
      "FirstName": "Neil",
      "LastName": "Bryant",
      "PhoneNumber": "319-296-3608",
      "EmailAddress": "NeilJBryant@dayrep.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 60,
      "FirstName": "Thomas",
      "LastName": "Davis",
      "PhoneNumber": "608-395-7694",
      "EmailAddress": "ThomasDavis@fleckens.hu",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 61,
      "FirstName": "Melissa",
      "LastName": "Morales",
      "PhoneNumber": "513-564-6489",
      "EmailAddress": "MelissaKMorales@einrot.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 62,
      "FirstName": "Ciara",
      "LastName": "Nieto",
      "PhoneNumber": "323-778-6481",
      "EmailAddress": "CiaraNietoBarrera@cuvox.de",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    },
    {
      "ID": 63,
      "FirstName": "Ademar",
      "LastName": "Briones",
      "PhoneNumber": "901-619-7623",
      "EmailAddress": "AdemarBrionesMendoza@jourrapide.com",
      "DateCreated": "2022-02-03 20:59:00",
      "UserID": 55
    }
  ],
  "error": ""
};