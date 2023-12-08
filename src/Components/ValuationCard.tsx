
import { Box, Card, CardContent, Rating, Typography } from '@mui/material'
import React from 'react'

import { Valuations } from '../Types/Types'

export const ValuationCard = ({ valuations }: any) => {
    return (
        <>
            {valuations.map((rating: Valuations, index: number) =>
                <Card key={index} sx={{ minWidth: 200, ml: 1, mb: 1 }}>
                    <CardContent >
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                                Gesamtbewertung
                            </Typography>
                            <Rating value={rating.total || null} readOnly precision={0.5} />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Produkt Typ
                            </Typography>
                            <Typography variant="body1">
                                {rating.productType || "Nicht ausgewählt"}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Geschmack
                            </Typography>
                            <Rating value={rating.taste || null} readOnly precision={0.5} />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Gewürze
                            </Typography>
                            <Rating value={rating.spices || null} readOnly precision={0.5} />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Erfahrung beim Kochen
                            </Typography>
                            <Rating value={rating.cookingExperience || 0} readOnly precision={0.5} />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Rezept
                            </Typography>
                            <Typography variant="body1">
                                {rating.receipeChoice}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Verpackung
                            </Typography>
                            <Rating value={rating.packaging || null} readOnly precision={0.5} />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Kommentar
                            </Typography>
                            <Typography variant="body1">
                                {rating.message}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
