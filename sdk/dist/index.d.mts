declare class ConsentCMS {
    private apiUrl;
    private clientId;
    constructor(config: {
        apiUrl: string;
        clientId: string;
    });
    grantConsent(userId: string, purposeCode: string): Promise<any>;
    revokeConsent(userId: string, purposeCode: string): Promise<any>;
    getConsents(userId: string): Promise<any>;
    hasConsent(userId: string, purposeCode: string): Promise<boolean>;
}

export { ConsentCMS };
