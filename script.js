const startTimeSelectElem = document.getElementById('start-time');
const endTimeSelectElem = document.getElementById('end-time');

let startHour = 8;
let endHour = 17;


populateDropDown(startTimeSelectElem, 8)
populateDropDown(endTimeSelectElem, 17)


function populateDropDown(selectElem, selectedValue){
    for(let i = 0; i<24; i++){
        let optionElem = document.createElement("option");
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00'
        hour += i < 12 ? ' AM' : ' PM'
        optionElem.text = hour;
        optionElem.value = i;
        if(i === selectedValue){
            optionElem.selected = true;
        }
        selectElem.appendChild(optionElem);
    }
}


startTimeSelectElem.addEventListener('change', function (){
    startHour = parseInt(this.value)
    createTimeTable();
})


endTimeSelectElem.addEventListener('change', function(){
    endHour = parseInt(this.value)
    createTimeTable();
})


function createTimeTable() {
    const divContainer = document.getElementById("timeTable");
    let tableHTML = '<table><thead><tr><th></th>'
    const days = ["Sunday", "Monday", "Tuesday", "Wedenesday", "Thrusday", "Friday"]
    days.forEach(day => {
        tableHTML += `<th class="day-header">${day}</th>` 
    })
    tableHTML += '</tr></thead><tbody>'

    for(let i =startHour; i<= endHour; i++){
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00'
        hour += i < 12 ? ' AM' : ' PM'

        tableHTML += `<tr><td class="time-label">${hour}</td>`;
        days.forEach(day =>{
            tableHTML += `
            <td class="time-slot" 
                onclick="toggleTimeSlot(this)"
                data-day="${day}"
                data-time="${hour}">
            </td>
            `;
        })
        tableHTML += `</tr>`
    }

    tableHTML += '</tbody></table>'
    divContainer.innerHTML = tableHTML;

}



const selectedTimeSlots = new Set();


function toggleTimeSlot(tdElem){
    const timeSlotId = `${tdElem.dataset.day}-${tdElem.dataset.time}`

    if(selectedTimeSlots.has(timeSlotId)){
        selectedTimeSlots.delete(timeSlotId);
        tdElem.classList.remove("selected");
    }else{
        selectedTimeSlots.add(timeSlotId);
        tdElem.classList.add("selected");
    }


}

document.getElementById("submitMeeting").addEventListener("click", async function () {
    const username = document.getElementById("user-name").value;
    const eventname = document.getElementById("event-name").value;

    if(!username || !eventname){
        alert('Please enter your name and the event name')
        return;
    };

    const bodyPayload = {
        username: username,
        eventname: eventname,
        slots: [...selectedTimeSlots]
    }
    const API_URL = 'https://jsonplaceholder.typicode.com/posts'
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(bodyPayload),
        headers: {
            'Content-type': 'application/json'
        }
    });

    const data = await response.json();
    console.log('The data is coming back from the server:')
    console.log(data)

})

createTimeTable();