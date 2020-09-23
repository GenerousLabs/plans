import { parse } from "path";
import { decodeOrFalse, parsePrivateKey } from "./boot.service";

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
});
