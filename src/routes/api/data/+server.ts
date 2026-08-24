import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DataHandler } from '$lib/data';

const REFRESH_INTERVAL = 1000 * 60 * 5;
const dataHandler = new DataHandler(true);

async function refresh(): Promise<void> {
	return dataHandler.fetchData().catch((err) => {
		console.error('Data refresh failed:', err);
	});
}

// Initial load
let refreshing = refresh();

// Background refresh on a fixed cadence - user requests never trigger
// upstream calls themselves, they only read the cached result
setInterval(() => {
	refreshing = refresh();
}, REFRESH_INTERVAL).unref();

export const GET: RequestHandler = async () => {
	await refreshing;
	return json(dataHandler.data);
};
