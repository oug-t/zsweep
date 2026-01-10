// src/routes/about/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// 1. Fetch 'win' and 'score' columns for ALL games played
	const { data, error } = await supabase
		.from('game_results')
		.select('win, score');

	if (error) {
		console.error('Error fetching stats:', error);
		return {
			stats: { started: 0, completed: 0, seconds: 0 }
		};
	}

	// 2. LOGIC IMPLEMENTATION
	
	// "Total Sweeps Started" -> Count of ALL rows (Wins + Losses)
	const started = data.length;

	// "Total Sweeps Completed" -> Count ONLY rows where win is TRUE
	const completed = data.filter((game) => game.win === true).length;

	// "Total Time Sweeping" -> Sum of 'score' from ALL rows (Wins + Losses)
	// This ensures time spent on failed attempts is counted.
	const seconds = data.reduce((total, game) => total + (game.score || 0), 0);

	return {
		stats: {
			started,
			completed,
			seconds
		}
	};
};
