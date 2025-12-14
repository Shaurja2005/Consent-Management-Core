// src/index.ts
var ConsentCMS = class {
  apiUrl;
  clientId;
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.clientId = config.clientId;
  }
  async grantConsent(userId, purposeCode) {
    const res = await fetch(`${this.apiUrl}/grant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clientId: this.clientId, purposeId: purposeCode })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Grant failed: ${errorText}`);
    }
    return res.json();
  }
  async revokeConsent(userId, purposeCode) {
    const res = await fetch(`${this.apiUrl}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, clientId: this.clientId, purposeId: purposeCode })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Revoke failed: ${errorText}`);
    }
    return res.json();
  }
  async getConsents(userId) {
    const res = await fetch(`${this.apiUrl}/list?userId=${userId}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Get consents failed: ${errorText}`);
    }
    return res.json();
  }
  async hasConsent(userId, purposeCode) {
    const consents = await this.getConsents(userId);
    return consents.some((c) => c.purpose.code === purposeCode && c.status === "GRANTED");
  }
};
export {
  ConsentCMS
};
