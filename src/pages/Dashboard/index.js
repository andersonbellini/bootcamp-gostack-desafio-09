import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';

import { MdAddCircle, MdChevronRight } from 'react-icons/md';
import { selectMeetupRequest } from '~/store/modules/meetup/actions';

import MeetAppButton from '~/components/MeetAppButton';
import { Container, MeetupList } from './styles';
import api from '~/services/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [meetups, setMeetups] = useState([]);

  useEffect(() => {
    async function loadMeetups() {
      const response = await api.get('/mymeetups');

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = response.data.map(meetup => {
        const compareDate = utcToZonedTime(meetup.date, timezone);

        return {
          ...meetup,
          formattedDate: format(compareDate, "d 'de' MMMM', às 'hh'h'", {
            locale: pt,
          }),
        };
      });

      setMeetups(data);
    }

    loadMeetups();
  }, []);

  function handleDetails(meetup) {
    console.tron.log(meetup);
    dispatch(selectMeetupRequest(meetup));
  }

  return (
    <Container>
      <header>
        <strong>My meetups</strong>
        <MeetAppButton type="button">
          <div>
            <MdAddCircle size={16} color="#fff" />
            <span>New meetup</span>
          </div>
        </MeetAppButton>
      </header>

      <ul>
        {meetups.map(meetup => (
          <MeetupList key={meetup.id} nonCancelable={!meetup.cancelable}>
            <strong>{meetup.title}</strong>
            <div>
              <span>{meetup.formattedDate}</span>
              <button type="button" onClick={() => handleDetails(meetup)}>
                <MdChevronRight size={22} color="#fff" />
              </button>
            </div>
          </MeetupList>
        ))}
      </ul>
    </Container>
  );
}
