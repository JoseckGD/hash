import { hashAlgorithmsArray } from "../constants/data";

export const HashAlgorithmSelect = ({
  hashAlgorithm,
  handleHashAlgorithmChange,
}) => {
  return (
    <select value={hashAlgorithm} onChange={handleHashAlgorithmChange}>
      {Object.keys(hashAlgorithmsArray).map((algorithm, index) => (
        <option key={index} value={algorithm}>
          {algorithm}
        </option>
      ))}
    </select>
  );
};
