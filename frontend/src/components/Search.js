import React, { useState } from 'react';
import { citySearch, hotelSearch, bookingSearch } from '../utils/api';

function Search() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await citySearch({
        cityid: event.target.cityid.value,
        checkin: event.target.checkin.value,
        checkout: event.target.checkout.value
      });
      setResults(data);
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const searchHotel = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await hotelSearch({
        hotelid: event.target.hotelid.value,
        checkin: event.target.checkin.value,
        checkout: event.target.checkout.value
      });
      setResults(data);
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  const searchBooking = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await bookingSearch({
        country: event.target.country.value,
        hotelid: event.target.hotelid.value,
        checkin: event.target.checkin.value,
        checkout: event.target.checkout.value
      });
      setResults(data);
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Hotel Search</h1>

      <h2>City Search</h2>
      <form onSubmit={searchCity} className="search-container">
        <input type="text" id="cityid" placeholder="Enter City ID" required />
        <input type="date" id="checkin" placeholder="Check-in Date" required />
        <input type="date" id="checkout" placeholder="Check-out Date" required />
        <button type="submit">Search City</button>
      </form>

      <h2>Hotel Search</h2>
      <form onSubmit={searchHotel} className="search-container">
        <input type="text" id="hotelid" placeholder="Enter Hotel ID" required />
        <input type="date" id="checkin" placeholder="Check-in Date" required />
        <input type="date" id="checkout" placeholder="Check-out Date" required />
        <button type="submit">Search Hotel</button>
      </form>

      <h2>Booking.com Search</h2>
      <form onSubmit={searchBooking} className="search-container">
        <input type="text" id="country" placeholder="Enter Country Code" required />
        <input type="text" id="hotelid" placeholder="Enter Hotel ID" required />
        <input type="date" id="checkin" placeholder="Check-in Date" required />
        <input type="date" id="checkout" placeholder="Check-out Date" required />
        <button type="submit">Search Booking.com</button>
      </form>

      {loading && <div id="loader" className="loader"></div>}
      {error && <div className="error">{error}</div>}
      {results && (
        <div id="results">
          {Array.isArray(results) ? (
            <div className="hotel-list">
              {results.map((hotel, index) => (
                <div key={index} className="hotel-card">
                  <h3>{hotel.name}</h3>
                  <p>Hotel ID: {hotel.hotelId}</p>
                  <p>Rating: {hotel.reviews.rating} ({hotel.reviews.count} reviews)</p>
                  <p>Phone: {hotel.telephone}</p>
                  <div className="price-list">
                    {Object.keys(hotel).filter(key => key.startsWith('vendor')).map((vendor, index) => {
                      const priceKey = `price${index + 1}`;
                      return <p key={vendor}>{hotel[vendor]}: {hotel[priceKey]}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : results.comparison ? (
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {results.comparison[0].map((item, index) => (
                  <tr key={index}>
                    <td>{item[`vendor${index + 1}`]}</td>
                    <td>{item[`price${index + 1}`]}</td>
                    <td>{item[`tax${index + 1}`]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="room-list">
              {results.map((room, index) => (
                <div key={index} className="room-card">
                  <h3>{room.room}</h3>
                  <p>Price: {room.price}</p>
                  <ul>
                    {room.payment_details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

