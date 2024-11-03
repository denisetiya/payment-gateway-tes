import { Response } from 'express';

const response = (
    res: Response,
    status: number,
    message?: string,
    data?: any,
    error?: string,
    header?: Record<string, string> 
) => {
    if (header) {
        Object.entries(header).forEach(([key, value]) => {
            res.setHeader(key, value); 
        });
    }
    res.status(status).json({
        status,
        message,
        data,
        error,
    });
};

export default response;
