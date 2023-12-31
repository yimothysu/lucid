import Link from "next/link";
import { CircleFlag } from "react-circle-flags";
import { useRouter } from "next/router";
export default function Footer() {
  const countries = [
    {
      countryCode: "us",
      link: "en",
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
    {
      countryCode: "cn",
      link: "zh",
    },
    {
      countryCode: "ar",
      link: "ar",
    },
    {
      countryCode: "ru",
      link: "ru",
    },
    {
      countryCode: "pt",
      link: "pt",
    },
    {
      countryCode: "jp",
      link: "ja",
    },
    {
      countryCode: "it",
      link: "it",
    },
    {
      countryCode: "nl",
      link: "nl",
    },
    {
      countryCode: "kr",
      link: "ko",
    },
    {
      countryCode: "tr",
      link: "tr",
    },
    {
      countryCode: "bn",
      link: "bn",
    },
    {
      countryCode: "uy",
      link: "ur",
    },
    {
      countryCode: "id",
      link: "id",
    },
  ];

  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "#f1f1ee",
        padding: "1em",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        gap: "1em",
        flexWrap: "wrap",
      }}
    >
      {countries.map((item, index) => {
        return (
          <Link
            key={`${item.countryCode} ${index}`}
            href={`/${item.link + "/" + router.asPath}`}
            locale={item.link}
          >
            <CircleFlag
              countryCode={`${item.countryCode}`}
              height="50px"
              className="footer__countryImg"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "50%",
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}
