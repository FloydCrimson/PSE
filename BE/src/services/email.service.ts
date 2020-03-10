import * as nodemailer from 'nodemailer';

export class EmailService {

    private readonly user: string = '';
    private readonly pass: string = '';

    constructor() { }

    public send(options: { to: string, subject: string, body: string }): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                const transport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: this.user,
                        pass: this.pass
                    }
                });
                const info = transport.sendMail(options, (error, info) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
                console.log(info);
            } catch (error) {
                reject(error);
            }
        });
    }

}
