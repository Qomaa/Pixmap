/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('index',
        {
            title: 'iota.show',
        }
    );
});

router.get('/table', (req: express.Request, res: express.Response) => {
    res.render('table',
        {
            title: 'iota.show',
        }
    );
});

export default router;