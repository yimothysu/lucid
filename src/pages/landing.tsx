import * as React from "react";

export default function Landing() {
  return (
    <>
      <div className="div">
        <div className="div-2">
          <div className="div-3">
            <div className="div-4">
              <div className="div-5">Home</div>
              <div className="div-6">Product</div>
              <div className="div-7">About</div>
              <div className="div-8">Contact</div>
            </div>
            <div className="div-9">
              <div className="div-10">Login</div>
            </div>
          </div>
          <div className="div-11">
            <div className="div-12">
              <div className="column"></div>
              <div className="column-2">
                <div className="div-13">
                  <div className="div-14">
                    <div className="div-15">
                      <div className="column-3">
                        <div className="div-16">
                          <div className="div-17">
                            <div className="div-18">
                              Lightning fast <br />
                              prototyping
                            </div>
                            <div className="div-19">
                              Most calendars are designed for teams. Slate is{" "}
                              <br />
                              designed for freelancers.
                            </div>
                          </div>
                          <div className="div-20">
                            <div className="div-21">
                              <div className="div-22">Get Started</div>
                            </div>
                            <div className="div-23">
                              <div className="div-24">Try For Free</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="column-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .div {
          align-items: flex-start;
          align-self: stretch;
          background-color: var(--light-background, #fff);
          display: flex;
          flex-direction: column;
        }
        .div-2 {
          align-items: center;
          align-self: stretch;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.22) 7.62%,
            rgba(0, 225, 198, 0.06) 25.5%,
            #fff 70.92%
          );
          display: flex;
          margin-top: 30px;
          margin-bottom: 30px;
          width: 100%;
          padding-top: 30px;
          flex-direction: column;
        }
        @media (max-width: 991px) {
          .div-2 {
            max-width: 100%;
          }
        }
        .div-3 {
          align-self: center;
          display: flex;
          width: 100%;
          max-width: 1101px;
          padding-right: 20px;
          padding-left: 20px;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }
        @media (max-width: 991px) {
          .div-3 {
            max-width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        .img {
          aspect-ratio: 3.21;
          object-fit: cover;
          object-position: center;
          width: 186px;
          overflow: hidden;
        }
        .div-4 {
          align-items: flex-start;
          align-self: center;
          display: flex;
          margin-top: auto;
          margin-bottom: auto;
          width: 387px;
          max-width: 100%;
          justify-content: space-between;
          gap: 20px;
        }
        @media (max-width: 991px) {
          .div-4 {
            justify-content: center;
          }
        }
        .div-5 {
          color: var(--first-text, #20262a);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 450;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: stretch;
        }
        .div-6 {
          color: var(--first-text, #20262a);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 450;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: stretch;
        }
        .div-7 {
          color: var(--first-text, #20262a);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 450;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: stretch;
        }
        .div-8 {
          color: var(--first-text, #20262a);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 450;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: stretch;
          text-wrap: nowrap;
        }
        @media (max-width: 991px) {
          .div-8 {
            text-wrap: initial;
          }
        }
        .div-9 {
          align-items: center;
          border-radius: 85px;
          border: 1px solid var(--primary, #00b6f0);
          align-self: center;
          display: flex;
          margin-top: auto;
          margin-bottom: auto;
          width: 140px;
          max-width: 100%;
          padding-top: 16px;
          padding-right: 20px;
          padding-bottom: 16px;
          padding-left: 20px;
          flex-direction: column;
        }
        .div-10 {
          color: var(--primary, #00b6f0);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: center;
          text-wrap: nowrap;
        }
        @media (max-width: 991px) {
          .div-10 {
            text-wrap: initial;
          }
        }
        .div-11 {
          align-self: stretch;
          margin-top: 171px;
          width: 100%;
          padding-right: 20px;
          padding-left: 20px;
        }
        @media (max-width: 991px) {
          .div-11 {
            max-width: 100%;
          }
        }
        .div-12 {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .div-12 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .column {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 16%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .column {
            width: 100%;
          }
        }
        .img-2 {
          aspect-ratio: 0.39;
          object-fit: cover;
          object-position: center;
          width: 100%;
          transform: rotate(68.941deg);
          fill: var(--primary, #00b6f0);
          opacity: 0.46;
          overflow: hidden;
          margin-top: 70px;
        }
        @media (max-width: 991px) {
          .img-2 {
            margin-top: 50px;
          }
        }
        .column-2 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 84%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-2 {
            width: 100%;
          }
        }
        .div-13 {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
        }
        @media (max-width: 991px) {
          .div-13 {
            max-width: 100%;
          }
        }
        .div-14 {
          align-self: end;
          width: 903px;
          max-width: 100%;
        }
        .div-15 {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .div-15 {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .column-3 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 62%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .column-3 {
            width: 100%;
          }
        }
        .div-16 {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 991px) {
          .div-16 {
            max-width: 100%;
            margin-top: 50px;
          }
        }
        .div-17 {
          align-items: center;
          align-self: stretch;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 991px) {
          .div-17 {
            max-width: 100%;
          }
        }
        .div-18 {
          color: var(--secondary, #112d57);
          text-align: center;
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 72px;
          font-weight: 900;
          line-height: 108.33%;
          letter-spacing: 0.2px;
          max-width: 490px;
          align-self: center;
        }
        @media (max-width: 991px) {
          .div-18 {
            max-width: 100%;
            font-size: 40px;
          }
        }
        .div-19 {
          color: var(--second-text, #5c5c5c);
          text-align: center;
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 24px;
          font-weight: 450;
          line-height: 158.33%;
          letter-spacing: 0.2px;
          align-self: stretch;
          margin-top: 37px;
        }
        @media (max-width: 991px) {
          .div-19 {
            max-width: 100%;
          }
        }
        .div-20 {
          align-items: flex-start;
          align-self: center;
          display: flex;
          margin-top: 94px;
          width: 411px;
          max-width: 100%;
          justify-content: space-between;
          gap: 20px;
        }
        .div-21 {
          align-items: center;
          border-radius: 85px;
          background-color: var(--primary, #00b6f0);
          align-self: stretch;
          display: flex;
          width: 192px;
          max-width: 100%;
          padding-top: 16px;
          padding-right: 20px;
          padding-bottom: 16px;
          padding-left: 20px;
          flex-direction: column;
        }
        .div-22 {
          color: var(--light-text, #fff);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: center;
          text-wrap: nowrap;
        }
        @media (max-width: 991px) {
          .div-22 {
            text-wrap: initial;
          }
        }
        .div-23 {
          align-items: center;
          border-radius: 85px;
          background-color: var(--light-background, #fff);
          align-self: stretch;
          display: flex;
          width: 194px;
          max-width: 100%;
          padding-top: 16px;
          padding-right: 20px;
          padding-bottom: 16px;
          padding-left: 20px;
          flex-direction: column;
        }
        .div-24 {
          color: var(--first-text, #20262a);
          font-family: Circular Std, -apple-system, Roboto, Helvetica,
            sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 111.11%;
          letter-spacing: 0.2px;
          align-self: center;
          text-wrap: nowrap;
        }
        @media (max-width: 991px) {
          .div-24 {
            text-wrap: initial;
          }
        }
        .column-4 {
          display: flex;
          flex-direction: column;
          line-height: normal;
          width: 38%;
          margin-left: 20px;
        }
        @media (max-width: 991px) {
          .column-4 {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
