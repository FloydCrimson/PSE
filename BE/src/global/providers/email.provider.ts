import * as nodemailer from 'nodemailer';
import * as mailerconfig from '../../../mailerconfig.json';

export class EmailProvider {

    public static send(options: { from: string, to: string, subject: string, text: string, html: string }): Promise<any> {
        return new Promise<{ info: any; }>((resolve, reject) => {
            const transport = nodemailer.createTransport(mailerconfig);
            transport.sendMail(options, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }

}
