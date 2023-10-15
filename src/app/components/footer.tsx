import Link from "next/link";
import { CircleFlag } from "react-circle-flags";
export default function Footer() {
  const countries = [
    {
      countryCode: "us",
      link: "",
    },
    {
      countryCode: "es",
      link: "es",
    },
    {
      countryCode: "fr",
      link: "fr",
    },
    {
      countryCode: "de",
      link: "de",
    },
    {
      countryCode: "in",
      link: "in",
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
          <Link
            key={`${item.countryCode}`}
            href={`${item.link}/`}
            locale={item.countryCode}
          >
            <CircleFlag
              countryCode={`${item.countryCode}`}
              height="50px"
              className="footer__countryImg"
            />
          </Link>
        );
      })}
    </div>
  );
}
