import {
  decodeOrFalse,
  getSharingKey,
  parsePrivateKey,
  parseRepoSharingKey,
} from "./key.service";

const exampleAscii = "http://user:pass@domain.ltd/foo/bar.git";
const exampleBase64 = "aHR0cDovL3VzZXI6cGFzc0Bkb21haW4ubHRkL2Zvby9iYXIuZ2l0";

describe("boot.service", () => {
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
  });
});
