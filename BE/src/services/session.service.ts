import * as EI from '../entities.index';

export class SessionService {

    private sessions: Map<string, { hawk: EI.HawkEntity, token: string }>;

    constructor() {
        this.sessions = new Map<string, { hawk: EI.HawkEntity, token: string }>();
    }

    getSession(id: string): { hawk: EI.HawkEntity, token: string } {
        return this.sessions.get(id);
    }

    setSession(id: string, hawk: EI.HawkEntity): string {
        return '';
    }

    removeSession(id: string): void {
        this.sessions.delete(id);
    }

}
