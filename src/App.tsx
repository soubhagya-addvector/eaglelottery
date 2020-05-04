import React, { useState, useEffect } from "react";
import {
  IonApp,
  IonHeader,
  IonContent,
  IonToolbar,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonDatetime,
  IonIcon,
} from "@ionic/react";
import { pricetagOutline } from "ionicons/icons";
import logo from "./eagle.png";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const slideConfig = {
  spaceBetween: 30,
  shadow: true,
  centeredSlides: true,
  slidesPerView: 1.4,
  initialSlide: 1,
  speed: 400,
};

const NO_DATA_MSG = "!! Select A Date To Display Data !!";

interface ILotteryData {
  date: string;
  time: string;
  ticket: string;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    "2019-12-15T13:47:20.789"
  );
  const [lotteryData, setLotteryData] = useState<Array<ILotteryData>>([]);
  const [latestLottery, setLatestLottery] = useState<Array<ILotteryData>>([]);
  const [datewiseLottery, setDatewiseLottery] = useState<Array<ILotteryData>>(
    []
  );

  useEffect(() => {
    fetch(
      "https://spreadsheets.google.com/feeds/cells/1v_EnEscfKP8tcCPB3zRAvdAsIP4jmfpjn6VKf-PC4E4/1/public/values?alt=json",
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => parseData(data.feed.entry));
  });

  // reading all rows of the google sheet and parsing into readable format
  const parseData = (data: Array<any>) => {
    let info: Array<ILotteryData> = [];
    // making sure data is not empty and has 3 data entries per row
    if (data && data.length % 3 == 0) {
      for (let index: number = 0; index < data.length; index = index + 3) {
        if (data[index]["gs$cell"]["col"] === "1") {
          let entry: ILotteryData = {
            date: new Date(data[index]["gs$cell"]["$t"]).toLocaleDateString(),
            time: data[index + 1]["gs$cell"]["$t"],
            ticket: data[index + 2]["gs$cell"]["$t"],
          };
          info.push(entry);
        }
      }

      //setting lottery data & history
      let infoLength: number = info.length;
      if (infoLength > 0) {
        setLatestLottery(
          infoLength > 3 ? info.slice(infoLength - 3, infoLength) : info
        );
        console.log(latestLottery);
        console.log(latestLottery.reverse());

        setLotteryData(info);
      }
    }
  };

  const handleDateChange = (chosenDate: string) => {
    setSelectedDate(chosenDate);

    //setting datewise lottery data
    const date = new Date(chosenDate).toLocaleDateString();
    setDatewiseLottery(lotteryData.filter((obj) => obj.date === date));
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <img src={logo} className="logo" />
              </IonCol>
              <IonCol>
                <IonText className="iTxt">Number Here</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem className="mb-2">
          <IonText>Latest Lottery Tickets</IonText>
        </IonItem>

        {latestLottery && latestLottery.length > 0 ? (
          latestLottery.reverse().map((obj) => (
            <IonCard className="ion-text-center mhw">
              <IonCardHeader>
                <IonIcon icon={pricetagOutline} className="fz" />
                <div>Ticket Number</div>
                <IonCardTitle>{obj.ticket}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonText>Date: {obj.date}</IonText>
                    </IonCol>
                    <IonCol>
                      <IonText>Time: {obj.time}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonText class="ndd">{NO_DATA_MSG}</IonText>
        )}

        <IonItem class="mt-2 mb-2">
          <IonLabel>Select A Date</IonLabel>
          <IonDatetime
            displayFormat="DD MMM YYYY"
            min="2019"
            max="2040"
            value={selectedDate}
            onIonChange={(e) => handleDateChange(e.detail.value!)}
          />
        </IonItem>

        {datewiseLottery && datewiseLottery.length > 0 ? (
          datewiseLottery.map((obj) => (
            <IonCard className="ion-text-center mhw">
              <IonCardHeader>
                <IonIcon icon={pricetagOutline} className="fz" />
                <div>Ticket Number</div>
                <IonCardTitle>{obj.ticket}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonText>Date: {obj.date}</IonText>
                    </IonCol>
                    <IonCol>
                      <IonText>Time: {obj.time}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonText class="ndd">{NO_DATA_MSG}</IonText>
        )}
      </IonContent>
    </IonApp>
  );
};

export default App;
