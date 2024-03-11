const fetch = require("node-fetch");

const http = require("http");
const https = require("https");

const { SidemailLocalError, SidemailApiError } = require("./errors");

const DEFAULT_HOST = "https://api.sidemail.io";
const DEFAULT_BASE_PATH = "/v1/";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

class ContactMethods {
	constructor({ performApiRequest }) {
		this.performApiRequest = performApiRequest;
	}

	async createOrUpdate(contactData) {
		if (!contactData) {
			throw new SidemailLocalError(
				`Missing contact data. First argument must be object with valid contact data.`
			);
		}

		return this.performApiRequest("contacts", contactData);
	}

	async find({ emailAddress } = {}) {
		if (!emailAddress) {
			throw new SidemailLocalError(
				`Missing emailAddress. First argument must be object containing emailAddress of contact you wish to find.`
			);
		}

		return this.performApiRequest(`contacts/${emailAddress}`, null, {
			method: "GET",
		});
	}

	async list({ paginationCursorNext } = {}) {
		let query = ``;

		if (paginationCursorNext) {
			query += `paginationCursorNext=${paginationCursorNext}`;
		}

		return this.performApiRequest(`contacts?${query}`, null, {
			method: "GET",
		});
	}

	async delete({ emailAddress } = {}) {
		if (!emailAddress) {
			throw new SidemailLocalError(
				`Missing emailAddress. First argument must be object containing emailAddress of contact you wish to delete.`
			);
		}

		return this.performApiRequest(`contacts/${emailAddress}`, null, {
			method: "DELETE",
		});
	}
}

class EmailMethods {
	constructor({ performApiRequest }) {
		this.performApiRequest = performApiRequest;
	}

	async send(data) {
		return this.performApiRequest("email/send", data, { method: "POST" });
	}

	async search(data) {
		return this.performApiRequest("email/search", data, { method: "POST" });
	}

	async get(id) {
		return this.performApiRequest(`email/${id}`, null, { method: "GET" });
	}

	async delete(id) {
		return this.performApiRequest(`email/${id}`, null, { method: "DELETE" });
	}
}

class ProjectMethods {
	constructor({ performApiRequest }) {
		this.performApiRequest = performApiRequest;
	}

	async create(data) {
		return this.performApiRequest("project", data, { method: "POST" });
	}

	async get() {
		return this.performApiRequest("project", null, { method: "GET" });
	}

	async update(data) {
		return this.performApiRequest("project", data, { method: "PATCH" });
	}

	async delete() {
		return this.performApiRequest("project", null, { method: "DELETE" });
	}
}

class Sidemail {
	constructor({ apiKey, host = DEFAULT_HOST }) {
		if (!apiKey) {
			throw new SidemailLocalError(
				`apiKey missing. First argument must be object containing your Sidemail API key.`
			);
		}

		this.apiKey = apiKey;
		this.host = host;
		this.performApiRequest = this.performApiRequest.bind(this);

		this.contacts = new ContactMethods({
			performApiRequest: this.performApiRequest,
		});
		this.email = new EmailMethods({
			performApiRequest: this.performApiRequest,
		});
		this.project = new ProjectMethods({
			performApiRequest: this.performApiRequest,
		});
	}

	getApiUrl(path) {
		return this.host + DEFAULT_BASE_PATH + path;
	}

	async performApiRequest(path, data, { method = "POST" } = {}) {
		const response = await fetch(this.getApiUrl(path), {
			method: method,
			...(data && { body: JSON.stringify(data) }),
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + this.apiKey,
				"Content-Type": "application/json",
			},
			agent: (_parsedURL) => {
				return _parsedURL.protocol == "http:" ? httpAgent : httpsAgent;
			},
		});

		const contentType = response.headers.get("content-type");

		if (!contentType.includes("application/json")) {
			throw new SidemailLocalError(
				`Sidemail API responded with unexpected contentType.`
			);
		}

		const json = await response.json();

		if (!response.ok) {
			throw new SidemailApiError(json);
		}

		return json;
	}

	async sendEmail(data) {
		return this.performApiRequest("email/send", data);
	}

	// Deprecated, here only to ensure backwards compatibility
	async sendMail(...args) {
		return this.sendEmail(...args);
	}
}

module.exports = function configureSidemail(config) {
	return new Sidemail(config);
};
