import { useState } from "react";
import "./App.css";
import { binaryText, hashAlgorithmsArray } from "./constants/data";
import { useRef } from "react";
import { HashAlgorithmSelect } from "./components/HashAlgorithmMenu";

function App() {
  const inputFile = useRef(null);
  const inputText = useRef(null);

  const [binary, setBinary] = useState(binaryText);
  const [SHAHash, setSHAHash] = useState(null);
  const [binaryResult, setBinaryResult] = useState(null);
  const [hashAlgorithm, setHashAlgorithm] = useState("SHA-256");

  const handleHashAlgorithmChange = (event) => {
    setHashAlgorithm(event.target.value);
    console.log(event.target.value);
  };

  const calculateSHABitsHash = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  };

  const encode = () => {
    if (binary.trim().length === 0) {
      inputText.current.focus();
      return;
    }

    if (!containsOnlyBinaryCharacters(binary)) {
      setBinary(stringToBinary(binary));
    }

    let allShaHash = "";

    getPartsToDivide().map((part, i) => {
      calculateSHABitsHash(part)
        .then((hash) => {
          allShaHash += hash;
        })
        .then(() => {
          if (i === getPartsToDivide().length - 1) {
            setSHAHash(allShaHash);
            setBinaryResult(hexadecimalToBinary(allShaHash));
          }
        });
    });
  };

  const getPartsToDivide = () => {
    let binaryLength = binary.length;
    let _binary = binary;
    const hashAlgoritBits = hashAlgorithmsArray[hashAlgorithm];

    if (!containsOnlyBinaryCharacters(binary)) {
      _binary = stringToBinary(binary);
      binaryLength = _binary.length;
    }

    const partsToDivide = [];

    for (let i = 0; i < binaryLength; i += hashAlgoritBits) {
      const part = _binary.substring(i, i + hashAlgoritBits);
      partsToDivide.push(part);
    }

    return partsToDivide;
  };

  const hexadecimalToBinary = (hex) => {
    const bigintValue = BigInt(`0x${hex}`);
    const binary = bigintValue.toString(2);
    return binary;
  };

  const containsOnlyBinaryCharacters = (str) => {
    const binaryRegex = /^[01]+$/;
    return binaryRegex.test(str);
  };

  const stringToBinary = (str) => {
    let binaryResult = "";

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const binaryChar = charCode.toString(2).padStart(8, "0");
      binaryResult += binaryChar;
    }

    return binaryResult;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("text/plain")) {
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsText(file);
    }
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    setBinary(content);
  };

  const handleReset = () => {
    setBinary("");
    setSHAHash(null);
    setBinaryResult(null);
    setHashAlgorithm("SHA-256");
  };

  return (
    <>
      <h1>Hash</h1>

      <section className="container inputs">
        <div className="input-container">
          <label htmlFor="text-file" className="input-label">
            Archivo de Texto:
          </label>
          <input
            type="file"
            accept=".txt"
            id="text-file"
            onChange={handleFileChange}
            ref={inputFile}
          />
        </div>

        <div className="input-container">
          <label htmlFor="binary" className="input-label">
            Binario:
          </label>
          <textarea
            name="binary"
            id="binary"
            cols="160"
            rows="10"
            style={{ resize: "none" }}
            value={binary}
            onChange={(e) => setBinary(e.target.value)}
            ref={inputText}
          />
        </div>

        <div className="input-container">
          <label className="input-label">
            Seleccione un Algoritmo de Hash:
          </label>
          <HashAlgorithmSelect
            hashAlgorithm={hashAlgorithm}
            handleHashAlgorithmChange={handleHashAlgorithmChange}
          />
        </div>
      </section>

      <section className="container buttons">
        <button className="button" onClick={encode}>
          Codificar
        </button>

        <button className="button-reiniciar" onClick={handleReset}>
          Reiniciar
        </button>
      </section>

      {SHAHash && (
        <>
          <h2>SHA 256 Hash Hexadecimal</h2>
          <section className="container firstPostulateAccounting">
            <p className="text">{SHAHash}</p>
          </section>

          <h2>SHA 256 Hash Binario</h2>
          <section className="container firstPostulateAccounting">
            <p className="text">{binaryResult}</p>
          </section>

          <section className="container buttons">
            <button className="button-reiniciar" onClick={handleReset}>
              Reiniciar
            </button>
          </section>
        </>
      )}
    </>
  );
}

export default App;
