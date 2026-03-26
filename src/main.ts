import logger from 'jet-logger';

import server from './server';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Server started on port: ${PORT}`);
});
