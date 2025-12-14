var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ConsentCMS: () => ConsentCMS
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConsentCMS
});
