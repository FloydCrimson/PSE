import * as nodemailer from 'nodemailer';
import * as mailerconfig from '../../../mailerconfig.json';

export class EmailService {

    constructor() { }

    public send(options: { from: string, to: string, subject: string, text: string, html: string }): Promise<{ data: any; success: boolean; }> {
        return new Promise<{ data: any; success: boolean; }>(async (resolve, reject) => {
            try {
                const transport = nodemailer.createTransport(mailerconfig);
                transport.sendMail(options, (error, info) => {
                    if (error) {
                        resolve({ data: error, success: false });
                    } else {
                        resolve({ data: info, success: true });
                    }
                });
            } catch (error) {
                resolve({ data: error, success: false });
            }
        });
    }

}
