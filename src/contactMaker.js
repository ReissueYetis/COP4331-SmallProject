function makeContactDiv(contact){
  let contactDiv = document.createElement("div");
}
function fillContactDiv(contact,contactDiv){
  contact.setAttribute("class","contact");
  let contactName = document.createElement("div");
  contactName.setAttribute("class","contactNameText");
  contactName.innerHTML = contact.firstName +" "+contact.lastName;
  contactName.setAttribute("contactID","")
}
