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
