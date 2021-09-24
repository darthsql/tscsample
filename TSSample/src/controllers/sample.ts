import { Request, Response, NextFunction } from 'express';
import { httpCodes } from '../../models';
import logging from '../config/logging';

const NAMESPACE = 'Mauricio Controller';

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, `Sample health check route called.`);

    return res.status(httpCodes.HttpOK).json({
        message: 'We were here'
    });
};

export default { sampleHealthCheck };
