import { CircleFlag } from "react-circle-flags";
export default function Navbar() {
  const countries = [
    {
      countryCode: "us",
    },
    {
      countryCode: "es",
    },
    {
      countryCode: "fr",
    },
    {
      countryCode: "de",
    },
    {
      countryCode: "in",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#f1f1ee",
        padding: "1em",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        gap: "1em",
      }}
    >
      {countries.map((item, index) => {
        return (
          <CircleFlag
            key={`${item.countryCode}`}
            countryCode={`${item.countryCode}`}
            height="50px"
          />
        );
      })}
    </div>
  );
}
