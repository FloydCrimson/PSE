import * as EI from '../../database/entities.index';

export class SessionService {

    private sessions: Map<string, { auth: EI.AuthEntity, token: string }>;

    constructor() {
        this.sessions = new Map<string, { auth: EI.AuthEntity, token: string }>();
    }

    getSession(id: string): { auth: EI.AuthEntity, token: string } {
        return this.sessions.get(id);
    }

    setSession(id: string, auth: EI.AuthEntity): string {
        return '';
    }

    removeSession(id: string): void {
        this.sessions.delete(id);
    }

}
