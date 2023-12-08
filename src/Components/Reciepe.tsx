import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react'

export const Reciepe = () => {
    return (
        <Box sx={{ ml: 2, mt: 2 }}>
            <Typography variant="h5">Alle Rezepte:</Typography>
            <Card>
                <CardContent>
                    <Typography variant="h5">Channa Daal Rezept</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        1 Tasse/n	Kichererbsen, halbierte (Chana Dal) <br />
                        evtl.	Wasser zum Einweichen <br />
                        1 EL	Ghee oder Öl<br />
                        0.5	Kardamomkapsel(n), grün<br />
                        1 Stück(e)	Zimt - Rinde (ca. 2 - 3 cm)<br />
                        0.5 TL	Kreuzkümmel, ganz<br />
                        Halbe Prise(n)	Asant<br />
                        ½ Tasse	Zwiebel(n), rote, gehackt<br />
                        ½ TL	Knoblauch, gerieben<br />
                        ½ TL	Chilischote(n), grün, gehackt<br />
                        0.5 Tasse	Tomate(n), püriert oder passierte aus der Dose<br />
                        ½ TL	Salz<br />
                        ½ TL	Kurkuma<br />
                        0.5 TL	Korianderpulver<br />
                        0.5 TL	Cayennepfeffer<br />
                        0.5 TL	Ingwer, in feine Streifen geschnitten<br />
                        etwas	Koriandergrün, frisch<br />
                        etwas	Chilischote(n), grün, in dünne Streifen geschnitten<br />
                        etwas	Zitronensaft, frisch gepresst<br />
                        n. B.	Wasser<br />
                    </Box>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h5">Rote Daal Rezept</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        ½ Tasse	Linsen, rote <br />
                        ½ Liter	Wasser <br />
                        1 EL	Öl <br />
                        ½ Stück(e)	Ingwer <br />
                        1 ½ Zehe/n	Knoblauch <br />
                        ¼ TL	Senfkörner <br />
                        ½ EL	Koriander, gemahlen <br />
                        ½ m.-große	Zwiebel(n), gehackt <br />
                        ½ kleine	Chilischote(n) <br />
                        ½ TL	Kurkuma <br />
                        ¼ TL	Kreuzkümmel, gemahlen <br />
                        1 Prisen	Pfeffer, schwarz <br />
                        ½ EL	Zitronensaft <br />
                        n. B.	Meersalz <br />
                        ½ Handvoll	Koriandergrün <br />
                        1	Tomate(n), aus der Dose <br />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
};