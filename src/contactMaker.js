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
function makeContactInfoContentDiv(divClass,email,phone){
  let ci = document.createElement("div");
  ci.setAttribute("class","row "+divClass);
  let emailDiv = document.createElement("div");
  emailDiv.setAttribute("class","col contactInfoText emailText");
  emailDiv.innerHTML = email;
  let phoneDiv= document.createElement("div");
  phoneDiv.setAttribute("class","col contactInfoText phoneText");
  phoneDiv.innerHTML = phone;
  ci.appendChild(emailDiv);
  ci.appendChild(phoneDiv);
  return ci;
}


// adds a contact
function addConCB(response, status, xhr){
  let newContact
  if (status !== "error") {
    if (response.error === "") {
      $("#addConAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.addConSucc)
      // re-search to show new contact
      let searchData = {
        "userId" : readCookie("id"), //55
        "search" : $("#searchBar").val()
      }
      postHandler(searchData, searchCB, API.searchCon)
    } else {
      $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.conExist)
      // $("#loginPass").removeClass("is-valid")
      // $("#loginUser").removeClass("is-valid")
    }
  } else {
    $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.addConErr)
  }
}


function deleteContact(id){
  let markedContact = document.getElementById(id);
  if(window.confirm("Are you sure you want to delete this contact?")){
    let data = {contactId:id};
    console.log(data, "\nIn"+ API.delCon);
    //API CALL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + site + API.delCon, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(JSON.stringify(data));
    console.log(urlBase + site + API.delCon);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        if (xhr.response.error === "") {
          markedContact.remove();
          window.alert("Contact successfully deleted")
          // re-search to remove deleted contact on page change
          let searchData = {
            "userId" : readCookie("id"),
            "search" : $("#searchBar").val()
          }
          postHandler(searchData, searchCB, API.searchCon)
        } else {
          window.alert("Contact does not exist")
        }
      }
    }
    console.log('HEY');
  }
}
/*
function deleteContact(id){
  let markedContact = document.getElementById(id);
  if(window.confirm("Are you sure you want to delete this contact?")){
    let data = {contactId:id};
    console.log(data, "\nIn"+ API.delCon)
    //API CALL
    $.ajax({
      url: urlBase + site + API.delCon,
      data: data,
      method: "POST",
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        console.log("SUCCESS:\n", response, textStatus)
        if (response.error === "") {
          markedContact.remove();
          window.alert("Contact successfully deleted")
        } else {
          window.alert("Contact does not exist")
        }
      },
      error: function(xhr, textStatus, error){
        console.log("\n\tERROR:\n", textStatus, error)
        window.alert("Communication error, please try again")
      }
    }).always(function (xhr, status, error) {
      console.log("IN ALWAYS,\n XHR:", xhr, "\nSTATUS:\n", status, "\nERR:\n", error)
    })
  }
}
*/

function makeEditButtons(contactID){
  let newRow = document.createElement("div");
  newRow.setAttribute("class","row editButtons");
  newRow.setAttribute("contactID",contactID);
  let confirmEditButton = document.createElement("button");
  let rejectEditButton = document.createElement("button");
  confirmEditButton.setAttribute("class","col text-right editContactButton");
  rejectEditButton.setAttribute("class","col removeContactButton");
  rejectEditButton.addEventListener("click",function(){ rejectEdit() });
  confirmEditButton.addEventListener("click",function(){ confirmEdit(contactID) });
  confirmEditButton.innerHTML = "Confirm Edit";
  rejectEditButton.innerHTML = "Reject Edit";
  newRow.appendChild(confirmEditButton);
  newRow.appendChild(rejectEditButton);
  return newRow;
}
function rejectEdit(){
  resetPageState();
}
function getChildValueByClass(parent,divClass){
  return parent.querySelector("."+divClass).value;
}
function apiCallForEdit(data){
    //API CALL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + site + API.editCon, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(JSON.stringify(data));
    console.log(urlBase + site + API.editCon);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        if (xhr.response.error === "") {

        } else {
        }
      }
    }
    console.log('HEY');
  }
function confirmEdit(contactID){
  //DO API CALL HERE
  // IF THE CALL IS VALID RESET STATE
  // OTHERWISE DISPLAY ISSUE AND WAIT UNTIL BUTTON IS PRESSED AGAIN
  let contact = document.getElementById(contactID);
  let firstName  = getChildValueByClass(contact,"firstname");
  let lastName  = getChildValueByClass(contact,"lastname");
  let email = getChildValueByClass(contact,"emailText");
  let phone = getChildValueByClass(contact,"phoneText");
  let apiCall = {"id": contactID,"firstName": firstName,"lastName": lastName,"emailAddress": email,"phoneNumber": phone};
  apiCallForEdit(apiCall);
  setTimeout(()=>{ resetPageState() },750);

}

// TODO: editcontact placeholder
function prepareDivEdit(id){
  let curContact = document.getElementById(id);
  // make the new name div and input fields
  let inputRow = curContact.querySelector(".contactNameText");
  let firstNameInput = document.createElement("input");
  let lastNameInput = document.createElement("input");
  // Set attributes
  firstNameInput.setAttribute("value",inputRow.getAttribute("firstname"));
  firstNameInput.setAttribute("class","firstname col");
  lastNameInput.setAttribute("value",inputRow.getAttribute("lastname"));
  lastNameInput.setAttribute("class","lastname col");
  // append the children to the row class
  inputRow.innerHTML = "";
  inputRow.appendChild(firstNameInput);
  inputRow.appendChild(lastNameInput);
  // do the same for email and phone
  let additionalInfoContentDiv = curContact.querySelector(".additionalInfoContent");
  let oldPhoneDiv = curContact.querySelector(".phoneText");
  let oldEmailDiv = curContact.querySelector(".emailText");
  let newPhoneDiv = document.createElement("input");
  let newEmailDiv = document.createElement("input");
  newPhoneDiv.setAttribute("value",oldPhoneDiv.innerHTML);
  newEmailDiv.setAttribute("value",oldEmailDiv.innerHTML);
  newPhoneDiv.setAttribute("class","phoneText contactInfoText col");
  newEmailDiv.setAttribute("class","emailText contactInfoText col");
  additionalInfoContentDiv.innerHTML = "";
  additionalInfoContentDiv.appendChild(newEmailDiv);
  additionalInfoContentDiv.appendChild(newPhoneDiv);
  // remove old buttons
  curContact.querySelector(".editButtons").remove();
  curContact.appendChild(makeEditButtons(id));
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
  editButton.addEventListener("click",function(){prepareDivEdit(contactID)});
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
  contactName.setAttribute("firstName",contact.FirstName);
  contactName.setAttribute("lastName",contact.LastName);
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
  let contactInfo =  makeContactInfoContentDiv("additionalInfoContent",contact.EmailAddress,contact.PhoneNumber)
  // now we append the children
  let editButtons = makeEditAndDeleteButtonDiv(number);
  contactDiv.appendChild(contactName);
  contactDiv.appendChild(extendButton);
  applyHidden(additionalInfo);
  applyHidden(editButtons);
  applyHidden(contactInfo);
  contactDiv.appendChild(additionalInfo);
  contactDiv.appendChild(contactInfo)
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
  let infoHeader = contact.querySelector(".additionalInfo");
  let infoContent = contact.querySelector(".additionalInfoContent");
  let editButtons = contact.querySelector(".editButtons");
  // if the div is hidden
  if(contact.getAttribute("infoHidden")=="true")
  {
    infoHeader.setAttribute("class","additionalInfo");
    contact.setAttribute("infoHidden","false");
    editButtons.setAttribute("class","row editButtons")
    infoContent.setAttribute("class","row additionalInfoContent");

  }
  else{
    applyHidden(infoHeader);
    applyHidden(infoContent);
    applyHidden(editButtons);
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
  loadContacts(currentResults,0,10);
  currentContact = 10;

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
  let searchBar = document.querySelector("#searchBar");

  postHandler({userId:userID, search:searchBar.value},searchCB,API.searchCon);
}

function searchCB(response, textStatus, xhr){
  if (textStatus !== "error") {
    if (response.error === "") {
      updatePageState(response.results)
      loadContacts(currentResults,0,CONTACTS_PER_PAGE);
      currentContact = CONTACTS_PER_PAGE;
    } else {
      // TODO: no contacts found error message
      updatePageState({});
      loadContacts(currentResults,0,CONTACTS_PER_PAGE);
    }
  } else {
    // TODO: please try again error msg
    // updatePageState(JSONResults.results)
    // loadContacts(JSONResults.results, 0, CONTACTS_PER_PAGE)
    // console.log(JSONResults)
  }
}
// this will get the ID of the current user with a cookie as well as call the empty search
// which will fill the page
function loadInitialPageState(){
  userID = readCookie("id");
}
function resetPageState(){
      loadContacts(currentResults,0,CONTACTS_PER_PAGE);
      currentContact = CONTACTS_PER_PAGE;
}
function updatePageState(results){
  currentResults = results;
}

// addSearchBarEL()
// postHandler({userId:userID, search:""},searchCB,API.searchCon);
addPageButtonListeners();
