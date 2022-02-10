let currentContact = 0;
const CONTACTS_PER_PAGE = 10;
let currentContact;
let userID;
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
  //ADD API CALL HERE
  markedContact.remove();

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
  let phoneNum = contact.phoneNum;
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
  if(currentContact < JSONResults.results.length){
    // if loading the next amount of contacts will go over the length
    // just go up to length
    if(currentContact + (CONTACTS_PER_PAGE) > JSONResults.results.length){
      loadContacts(JSONResults.results,currentContact,JSONResults.results.length);
      currentContact = JSONResults.results.length;
    }
    else{
      loadContacts(JSONResults.results,currentContact,currentContact+(CONTACTS_PER_PAGE*2));
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
      loadContacts(JSONResults.results,currentContact-(CONTACTS_PER_PAGE*2),currentContact-CONTACTS_PER_PAGE);
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
function addSearchBarEL(){
  let searchBar = document.querySelector("searchBar");
  // on every change to the search bar there will be a search executed
  searchBar.addEventListener("input",function(){searchAndUpdate(userID)});
}
function searchAndUpdate(id){

}
function searchCB(response, textStatus, xhr){
  if (textStatus !== "error") {
    if (response.error === "") {
      loadContacts(response.results, 0, 10)
    } else {
      // TODO: no contacts found error message
    }
  } else {
    // TODO: please try again error msg
    loadContacts(JSONResults, 0, 10)
    // console.log(JSONResults)
  }

}
// this will get the ID of the current user with a cookie as well as call the empty search
// which will fill the page
function loadInitialPageState(){

}
// loadContacts(JSONResults.results,0,10);
addPageButtonListeners();
addSearchBarEL():
currentContact+=10;

