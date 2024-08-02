const { isFuture, isPast, isToday } = require('date-fns');
const { cabins } = require('./data-cabins');
const { bookings } = require('./data-bookings');
const { guests } = require('./data-guests');
const { subtractDates } = require('./heplers'); // Ensure 'helpers' is correctly spelled

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
	'https://ttpaoolcxryjssbkxknk.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cGFvb2xjeHJ5anNzYmt4a25rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjYwNDc5NiwiZXhwIjoyMDM4MTgwNzk2fQ.0ZUhlJ5dyiENS0lxcSKD3gFA4P8g22tTToD8_Nt7i6Q'
);

async function deleteGuests() {
	const { error } = await supabase.from('guests').delete().gt('id', 0);
	console.log('deleted');
	if (error) console.log(error.message);
}

async function deleteCabins() {
	const { error } = await supabase.from('cabins').delete().gt('id', 0);
	console.log('deleted');
	if (error) console.log(error.message);
}

async function deleteBookings() {
	const { error } = await supabase.from('bookings').delete().gt('id', 0);
	console.log('deleted');
	if (error) console.log(error.message);
}

async function createGuests() {
	const { error } = await supabase.from('guests').insert(guests);
	if (error) console.log(error.message);
}

async function createCabins() {
	const { error } = await supabase.from('cabins').insert(cabins);
	if (error) console.log(error.message);
}

async function createBookings() {
	const { data: guestsIds } = await supabase
		.from('guests')
		.select('id')
		.order('id');
	const allGuestIds = guestsIds.map((guest) => guest.id);
	const { data: cabinsIds } = await supabase
		.from('cabins')
		.select('id')
		.order('id');
	const allCabinIds = cabinsIds.map((cabin) => cabin.id);

	const finalBookings = bookings.map((booking) => {
		// Here relying on the order of cabins, as they don't have an ID yet
		const cabin = cabins.at(booking.cabinId - 1);
		const numNights = subtractDates(booking.endDate, booking.startDate);
		const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
		const extrasPrice = booking.hasBreakfast
			? numNights * 15 * booking.numGuests
			: 0; // hardcoded breakfast price
		const totalPrice = cabinPrice + extrasPrice;

		let status;
		if (
			isPast(new Date(booking.endDate)) &&
			!isToday(new Date(booking.endDate))
		)
			status = 'checked-out';
		if (
			isFuture(new Date(booking.startDate)) ||
			isToday(new Date(booking.startDate))
		)
			status = 'unconfirmed';
		if (
			(isFuture(new Date(booking.endDate)) ||
				isToday(new Date(booking.endDate))) &&
			isPast(new Date(booking.startDate)) &&
			!isToday(new Date(booking.startDate))
		)
			status = 'checked-in';

		return {
			...booking,
			numNights,
			cabinPrice,
			extrasPrice,
			totalPrice,
			guestId: allGuestIds.at(booking.guestId - 1),
			cabinId: allCabinIds.at(booking.cabinId - 1),
			status,
		};
	});

	// console.log(finalBookings);

	const { error } = await supabase.from('bookings').insert(finalBookings);
	if (error) console.log(error.message);
}

async function uploadAll() {
	// Bookings need to be deleted FIRST
	await deleteBookings();
	await deleteGuests();
	await deleteCabins();

	// Bookings need to be created LAST
	await createGuests();
	await createCabins();
	await createBookings();
}

async function uploadBookings() {
	await deleteBookings();
	await createBookings();
}

(async () => {
	await uploadAll();
	await uploadBookings();
})();
