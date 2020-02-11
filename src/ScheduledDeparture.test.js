/**
 * Created by dsaari on 2/10/20.
 */
import React from 'react';
import { render } from '@testing-library/react';
import ScheduledDeparture from './ScheduledDeparture';

test('displays time in EU format', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('13:03');
  expect(linkElement).toBeInTheDocument();
});

test('shows destination', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('Mars');
  expect(linkElement).toBeInTheDocument();
});

test('shows train number', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('11');
  expect(linkElement).toBeInTheDocument();
});

test('displays TBD if track is empty', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('TBD');
  expect(linkElement).toBeInTheDocument();
});

test('displays track number when populated', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track="13"
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('13');
  expect(linkElement).toBeInTheDocument();
});

test('displays On time if status empty', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status=""/>
      </tbody>
  </table>
  );
  const linkElement = getByText('On time');
  expect(linkElement).toBeInTheDocument();
});

test('displays status when populated', () => {
  const { getByText } = render(
  <table>
      <tbody>
        <ScheduledDeparture departure_time={new Date('Mon Feb 10 2020 13:03:33 GMT-0500 (Eastern Standard Time)')}
                            destination="Mars"
                            train="11"
                            track=""
                            status="Delayed"/>
      </tbody>
  </table>
  );
  const linkElement = getByText('Delayed');
  expect(linkElement).toBeInTheDocument();
});

