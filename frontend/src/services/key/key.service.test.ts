import {
  assertIsUrl,
  decodeOrFalse,
  getSharingKey,
  parsePrivateKey,
  parseRepoSharingKey,
} from "./key.service";

const exampleAscii = "http://user:pass@domain.ltd/foo/bar.git";
const exampleBase64 = "aHR0cDovL3VzZXI6cGFzc0Bkb21haW4ubHRkL2Zvby9iYXIuZ2l0";
const fooAscii = "foo";
const fooBase64 = "Zm9v";

describe("boot.service", () => {
  describe("assertIsUrl()", () => {
    it("Throws for foo #wNpiOE", () => {
      expect(() => assertIsUrl("foo")).toThrow();
    });
  });

  describe("decodeOrFalse", () => {
    it("Returns the string #rxaTxI", () => {
      expect(decodeOrFalse(exampleBase64)).toEqual(exampleAscii);
    });
  });

  describe("parsePrivateKey()", () => {
    it("Correctly parses the 1st generation encoded string #vuOmvG", () => {
      expect(parsePrivateKey(exampleBase64)).toEqual(exampleAscii);
    });

    it("Correctly parses the unencoded URL #IdpjBv", () => {
      expect(parsePrivateKey(exampleAscii)).toEqual(exampleAscii);
    });

    it("Correctly parses PRIVATE_key #q8WKmK", () => {
      expect(parsePrivateKey(`PRIVATE_${exampleBase64}`)).toEqual(exampleAscii);
    });

    it("Throws for PRIVATE_nonsense #EyxK3M", () => {
      expect(() => parsePrivateKey(`PRIVATE_${exampleAscii}`)).toThrow();
    });

    it("Throws for FOO_key #LZa1eK", () => {
      expect(() => parsePrivateKey(`FOO_${exampleBase64}`)).toThrow();
    });

    it("Throws for a key which is not a URL #dUI4O3", () => {
      expect(() => parsePrivateKey(`PRIVATE_${fooBase64}`)).toThrow();
    });

    it("Throws for a string which is not a URL #GcZrzN", () => {
      expect(() => parsePrivateKey(fooAscii)).toThrow();
    });

    it("Throws for an invalid base64 string which is not a URL #ZlGO7e", () => {
      expect(() => parsePrivateKey("foo*")).toThrow();
    });
  });

  describe("getSharingKey", () => {
    it("Returns the correct key #bGobvl", () => {
      expect(
        getSharingKey({ token: "pass", username: "foo" })
      ).toMatchSnapshot();
    });
  });

  describe("parseRepoSharingKey()", () => {
    it("Accepts a naked sharing kep #YXEGf8", () => {
      expect(parseRepoSharingKey(exampleBase64)).toEqual(exampleAscii);
    });

    it("Accepts a SHARING_USER_key #HcDIJc", () => {
      expect(parseRepoSharingKey(`SHARING_foo_${exampleBase64}`)).toEqual(
        exampleAscii
      );
    });

    it("Throws for a PRIVATE_key #KGyBLR", () => {
      expect(() => parseRepoSharingKey(`PRIVATE_${exampleBase64}`)).toThrow();
    });

    it("Throws for a PRIVATE_invalidKey #n4ybWq", () => {
      expect(() => parseRepoSharingKey(`PRIVATE_${exampleAscii}`)).toThrow();
    });

    it("Throws for a invalidKey #jOkBKv", () => {
      expect(() => parseRepoSharingKey(exampleAscii)).toThrow();
    });

    it("Throws for a key which is not a URL #ytzN61", () => {
      expect(() => parseRepoSharingKey(`SHARING_foo_${fooBase64}`)).toThrow();
    });

    it("Throws for a naked key which is not a URL #70sDOn", () => {
      expect(() => parseRepoSharingKey(fooBase64)).toThrow();
    });

    it("Throws for a naked key which is not base64 decodeable and not a URL #bFSIhC", () => {
      expect(() => parseRepoSharingKey("foo*")).toThrow();
    });
  });
});
