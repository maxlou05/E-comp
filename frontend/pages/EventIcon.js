import React from 'react';
import ReactDOM from 'react-dom/client';

import IconStyles from '../styles/EventIcon.module.css'
import GridStyles from'../styles/EventIconGrid.module.css'

export function eventIcon(EventData){
  return(
  <div className={IconStyles.grid}>
    <div className={IconStyles.card}>
      <h3> {EventData.Name} </h3>
    </div>
  </div>
  )
}
//  // Back-end will return list of events + event meta data when provided with user token
//    const UserEventData = [{Name: "event1", startDate: Date(5/5/2023), endDate: Date(5/15/2023), icon: null, userPoints: 4}]

export default function EventIconGrid(UserEventData){
    const EventData = UserEventData.map(EventData =>
       eventIcon(EventData)
      );

      return (
        <ul>{EventData}</ul>
      )
}