import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { format } from "date-fns";


const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "PPpp");
};

function TaskCard({ cardProps, handleOpen, onDelete }) {
    console.log("CardProps: ", cardProps)
    if (!cardProps) return null;
    return (
        <Grid item xs={12}>
            {/* Each card is an item in the column grid */}
            <Card variant="outlined" sx={{ minWidth: 270 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {cardProps.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Owner: {cardProps.owner}
                    </Typography>
                    {/* ToDo: Description should render new lines, right not it eats /n */}
                    <Typography variant="body2">{cardProps.description}</Typography>
                    <Chip
                        label={cardProps.status}
                        color="primary"
                        style={{ marginTop: "10px" }}
                    />
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                    >
                        Created at: {formatDate(cardProps.created_at)}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Updated at: {formatDate(cardProps.updated_at)}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => handleOpen(cardProps)}
                        sx={{ mt: 2 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(cardProps.id)}
                        sx={{ mt: 2 }}
                    >
                        Delete
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default TaskCard;