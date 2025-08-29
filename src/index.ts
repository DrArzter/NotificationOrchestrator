import express from 'express';

import eventRoutes from './routes/events.routes';
import preferencesRoutes from './routes/preferences.routes';

const main = () => {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get('/', (req, res) => {
		res.status(200).send({ message: 'Hello There!' });
	});

	app.use('/events', eventRoutes)
	app.use('/preferences', preferencesRoutes)

	const port = Number.parseFloat(process.env.PORT ?? '3000');

	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
};

main();
