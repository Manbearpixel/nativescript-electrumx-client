var ElectrumxClient = require("nativescript-electrumx-client").ElectrumxClient;
var electrumxClient = new ElectrumxClient();

describe("greet function", function() {
    it("exists", function() {
        expect(electrumxClient.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(electrumxClient.greet()).toEqual("Hello, NS");
    });
});