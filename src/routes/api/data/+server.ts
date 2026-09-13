import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DataHandler } from '$lib/data';

const REFRESH_INTERVAL = 1000 * 60;
const dataHandler = new DataHandler(false);

async function refresh(): Promise<void> {
	return dataHandler.fetchData().catch((err) => {
		console.error('Data refresh failed:', err);
	});
}

// Initial load
let refreshing = refresh();

setInterval(() => {
	refreshing = refresh();
}, REFRESH_INTERVAL).unref();

export const GET: RequestHandler = async () => {
	await refreshing;
	return json(dataHandler.data);
};
