import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useState } from "react";

import { capturePaypalPayment, createPaypalOrder } from "../firebase";
import { PageStatus } from "../Types/enum";
// Renders errors or successfull transactions on the screen.
export const Message = ({ content }: { content: string }) => {
  return <p>{content}</p>;
};

export const PayPal = () => {
  const [message, setMessage] = useState("");
  const [pages, setPages] = useState<number>(10);
  const [pageStatus, setPageStatus] = useState<PageStatus>(
    PageStatus.Selecting
  );
  const paypalClientID =
    "AZp9UIC7mIIFrSGekzyoRq2OPythFC_uSNu_beneqPB0F4IpgpcrsawFdhmuEo9HvZaGxT4KfVOWPnul" ||
    "";
  const initialOptions = {
    clientId: "test",
    enableFunding: "paylater,venmo,card",
    disableFunding: "",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };
  return (
    <Box>
      <Accordion
        variant="outlined"
        square={true}
        sx={{
          borderRadius: 5,
          backgroundColor: "transparent",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Bezahlmethode auswählen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PayPalScriptProvider
            options={{
              clientId: paypalClientID,
              currency: "EUR",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{
                color: "blue",
                shape: "pill",
              }}
              createOrder={async (): Promise<string> =>
                (await createPaypalOrder(pages)).id
              }
              onApprove={async (data) => {
                await capturePaypalPayment(data.orderID);
                setMessage("Thanks for your purchase!");
                setPageStatus(PageStatus.Complete);
              }}
            />
          </PayPalScriptProvider>
        </AccordionDetails>
        {message && (
          <Box sx={{ width: 200 }}>
            <Message content={message} />
          </Box>
        )}
      </Accordion>
    </Box>
  );
};
