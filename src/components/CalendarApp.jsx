import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {useState} from 'react'
const CalendarApp = () => {
    const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    const monthsOfYear=["January","February","March","April","May","June","July","August","September","October","November","December" ]
    const currentDate= new Date()

    const[currentMonth,setCurrentMonth]=useState(currentDate.getMonth())
    const[currentYear,setCurrentYear]=useState(currentDate.getFullYear())
    const[selectedDate,setSelectedDate]=useState(currentDate)
    const[showEventPopup, setShowEventPopup]=useState(false)
    const[events,setEvents]=useState([])
    const[eventTime,setEventTime]=useState({hours:'00',minutes:"00"})
    const[eventText,setEventText]=useState('')
    const[editingEvent,setEditingEvent]=useState(null)
    const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate()
    const firstDayOfMonth=new Date(currentYear,currentMonth,1).getDay()

    const prevMonth = () => {
  setCurrentMonth((prev) => {
    if (prev === 0) {
      setCurrentYear((y) => y - 1);
      return 11;
    }
    return prev - 1;
  });
};

const nextMonth = () => {
  setCurrentMonth((prev) => {
    if (prev === 11) {
      setCurrentYear((y) => y + 1);
      return 0;
    }
    return prev + 1;
  });
};

const handleDayClick=(day)=>{
    const clickedDate=new Date(currentYear,currentMonth,day)
    const today=new Date()

    if(clickedDate){
        setSelectedDate(clickedDate)
        setShowEventPopup(true)
        setEventText("")
        setEventTime({hours:'00',minutes:"00"})
        setEditingEvent(null)

    }
}
const closePopup = () => {
    setShowEventPopup(false);
};

const handleEventSubmit=()=>{
    const newEvent={
        id:editingEvent?editingEvent.id: Date.now(),
        date: selectedDate,
        time: `${eventTime.hours.padStart(2,'0')}:${eventTime.minutes.padStart(2,'0')}`,
        text:eventText
    }

    let updatedEvents=[...events]

    if(editingEvent){
        updatedEvents=updatedEvents.map((event)=>
        event.id===editingEvent.id?newEvent:event,
    )}else{
        updatedEvents.push(newEvent)

    }
    
    updatedEvents.sort((a,b)=>new Date(a.date)-new Date(b.date))
    setEvents(updatedEvents)
    setEventTime({hours:'00',minutes:"00"})
    setShowEventPopup(false)
    setEditingEvent(null)
}


const handleEditEvent=(event)=>{
    setSelectedDate(new Date(event.date))
    setEventTime({
        hours: event.time.split(':')[0],
        minutes: event.time.split(':')[1],
        
    })
    setEventText(event.text)
    setEditingEvent(event)
    setShowEventPopup(true)
}
  return (
    <div className="calendar-app">
        <div className="calendar">
          <h1 className="heading">Calendar</h1>  
          <div className="navigate-date"><h2 className="month">{monthsOfYear[currentMonth]},</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <button className="btn-left" onClick={prevMonth}>
                <ChevronLeftIcon className="icon-small" />
            </button>
            <button className="btn-right" onClick={nextMonth}><ChevronRightIcon className="icon-small" /></button>
           
          </div></div>
          
          <div className="weekdays">
                {
                    daysOfWeek.map((day)=><span key={day}>{day}</span>)
                }
            </div>
            <div className="days">
                {
                    [...Array(firstDayOfMonth).keys()].map((_,index)=>(
                    <span key={`empty-${index}`} />
                ))
                }
                {
                    [...Array(daysInMonth).keys()].map((day)=>(
                    <span key={day+1} className={
                        day+1===currentDate.getDate()&&
                        currentMonth===currentDate.getMonth()&&
                        currentYear===currentDate.getFullYear()
                        ?'currentDay':''}
                        onClick={()=>handleDayClick(day+1)}
                        >
                            {day+1}</span>
                    ))
                }
              
            </div>
        </div>
        <div className="events">
            {showEventPopup &&(
                 <div className="event-popup">
                <div className="time-input">
                    <div className="event-popup-time">Time</div>
                    <input type="number" name="hours" min={0} max={24} className="hours" value={eventTime.hours} onChange={(e)=>setEventTime({...eventTime,hours:e.target.value})}/>
                    <input type="number" name="minutes" min={0} max={60} className="minutes" value={eventTime.minutes}onChange={(e)=>setEventTime({...eventTime,minutes:e.target.value})}/>
                </div>
                <textarea placeholder="Enter Event Text (min 60 characters)" 
                value={eventText} onChange={(e)=>{
                    if(e.target.value.length<=60){
                        //dodac bledy mozna tutaj
                        setEventText(e.target.value)
                    }
                }}
                ></textarea>
                <button className="event-popup-btn" onClick={handleEventSubmit}>Add event</button>
                <button className="close-event-popup" onClick={closePopup}>
                     <XMarkIcon className="icon-small" />

                </button>
                

            </div>
            )}
           {events.map((event,index)=>(
            <div className="event" key={index}>
                <div className="event-date-wrapper">
                    <div className="event-date">
                         {`${monthsOfYear[event.date.getMonth()]} ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
                    <div className="event-time">{event.time}</div>
                </div>
                <div className="event-text">{event.text}</div>
                <div className="event-buttons">
                    <button className="edit-btn" onClick={()=>handleEditEvent(event)}>
                    <PencilSquareIcon className="icon-small" />
                    </button>
                     <button className="delete-btn">
                    <XMarkIcon className="icon-small" />
                    </button>
                </div>
            </div>
))}
            
        </div>
    </div>
  )
}

export default CalendarApp

