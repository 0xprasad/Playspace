export const grounds = [
  {
    id: 1,
    name: 'Boundary Arena',
    city: 'Bengaluru',
    address: 'HSR Layout',
    pricePerHour: 1800,
    amenities: ['floodlights', 'parking', 'washrooms']
  },
  {
    id: 2,
    name: 'Powerplay Turf',
    city: 'Bengaluru',
    address: 'Indiranagar',
    pricePerHour: 2200,
    amenities: ['floodlights', 'dugout', 'drinking-water']
  }
];

export const slots = [
  { id: 101, groundId: 1, time: '06:00 - 07:00', status: 'available' },
  { id: 102, groundId: 1, time: '07:00 - 08:00', status: 'booked' },
  { id: 201, groundId: 2, time: '19:00 - 20:00', status: 'available' }
];
