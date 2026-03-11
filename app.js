// STORAGE

let industries = JSON.parse(localStorage.getItem("industries")) || [
"Logistics",
"Construction",
"Manufacturing",
"Real Estate",
"Consulting",
"IT Services"
];

let tracker = JSON.parse(localStorage.getItem("tracker")) || [];

let reminders = [];


// ELEMENTS

const industrySelect = document.getElementById("industrySelect");
const searchIndustry = document.getElementById("searchIndustry");
const newIndustry = document.getElementById("newIndustry");
const addIndustryBtn = document.getElementById("addIndustryBtn");

const defaultLocationInput = document.getElementById("defaultLocation");

const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const resultsTable = document.querySelector("#resultsTable tbody");
const trackerTable = document.querySelector("#trackerTable tbody");

const notificationList = document.getElementById("notifications");
const popup = document.getElementById("popupReminder");


// SAVE

function saveIndustries(){
localStorage.setItem("industries",JSON.stringify(industries));
}

function saveTracker(){
localStorage.setItem("tracker",JSON.stringify(tracker));
}



// RENDER INDUSTRIES

function renderIndustries(){

industrySelect.innerHTML="";
searchIndustry.innerHTML="";

industries.forEach(ind =>{

let opt1=document.createElement("option");
opt1.value=ind;
opt1.textContent=ind;

let opt2=opt1.cloneNode(true);

industrySelect.appendChild(opt1);
searchIndustry.appendChild(opt2);

});

}


// ADD INDUSTRY

addIndustryBtn.onclick=function(){

let name=newIndustry.value.trim();

if(!name) return;

industries.push(name);

saveIndustries();

renderIndustries();

newIndustry.value="";

};



// DEFAULT LOCATION

function setDefaults(){

let loc=defaultLocationInput.value;

localStorage.setItem("defaultLocation",loc);

alert("Defaults saved");

}



// MESSAGE TEMPLATE

document.getElementById("saveTemplate").onclick=function(){

let template={
subject:subjectInput.value,
message:messageInput.value
};

localStorage.setItem("template",JSON.stringify(template));

alert("Template saved");

};



// FIND BUSINESSES (SIMULATED)

document.getElementById("findBusinesses").onclick=function(){

resultsTable.innerHTML="";

let industry=searchIndustry.value;
let city=document.getElementById("searchLocation").value;

for(let i=1;i<=5;i++){

let row=document.createElement("tr");

row.innerHTML=`

<td>${industry} Business ${i}</td>
<td>contact${i}@example.com</td>
<td>+27 000000${i}</td>
<td>example${i}.com</td>
<td>
<button onclick="sendToTracker('${industry} Business ${i}','${industry}','${city}','contact${i}@example.com')">
Add
</button>
</td>

`;

resultsTable.appendChild(row);

}

};



// ADD TO TRACKER

function sendToTracker(name,industry,location,contact){

let entry={

name,
industry,
location,
contact,
platform:"Email",
status:"Message Sent",
followup:Date.now()+86400000

};

tracker.unshift(entry);

saveTracker();

renderTracker();

}



// STATUS CLASS

function statusClass(status){

if(status==="Message Sent") return "status-sent";
if(status==="Waiting Reply") return "status-wait";
if(status==="Replied") return "status-replied";
if(status==="Follow Up") return "status-follow";
if(status==="Closed") return "status-closed";

return "";

}



// RENDER TRACKER

function renderTracker(){

trackerTable.innerHTML="";

tracker.forEach((lead,index)=>{

let remaining=lead.followup-Date.now();

let minutes=Math.floor(remaining/60000);

let timerText=minutes+"m";

let timerClass="";

if(minutes<=30) timerClass="timer-warning";
if(minutes<=15) timerClass="timer-danger";

let row=document.createElement("tr");

row.innerHTML=`

<td>${lead.name}</td>
<td>${lead.industry}</td>
<td>${lead.location}</td>
<td>${lead.contact}</td>
<td>${lead.platform}</td>
<td class="${statusClass(lead.status)}">${lead.status}</td>
<td>${new Date(lead.followup).toLocaleString()}</td>
<td class="${timerClass}">${timerText}</td>

<td>

<button onclick="editStatus(${index})">Edit</button>
<button onclick="deleteLead(${index})">Delete</button>

</td>

`;

trackerTable.appendChild(row);

});

}



// DELETE

function deleteLead(i){

tracker.splice(i,1);

saveTracker();

renderTracker();

}



// EDIT STATUS

function editStatus(i){

let newStatus=prompt("Update status");

if(!newStatus) return;

tracker[i].status=newStatus;

saveTracker();

renderTracker();

}



// REMINDER SYSTEM

function checkReminders(){

notificationList.innerHTML="";

tracker.forEach(lead=>{

let diff=lead.followup-Date.now();

let minutes=Math.floor(diff/60000);

if(minutes<=60 && minutes>0){

let li=document.createElement("li");

li.textContent=`Follow up with ${lead.name} in ${minutes} minutes`;

notificationList.appendChild(li);

}

if(minutes<=15 && minutes>0){

popup.style.display="block";

}

});

}



// CLOSE POPUP

document.getElementById("dismissPopup").onclick=function(){

popup.style.display="none";

};



// TOGGLE NOTIFICATIONS

function toggleNotifications(){

let panel=document.getElementById("notificationPanel");

if(panel.style.display==="block"){

panel.style.display="none";

}else{

panel.style.display="block";

}

}



// TIMER LOOP

setInterval(()=>{

checkReminders();

renderTracker();

},60000);



// INIT

renderIndustries();

renderTracker();